package main

import (
	"bytes"
	_ "embed"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"net/url"
	"os"
	"path/filepath"
	"regexp"
	"strconv"
	"strings"
)

var (
	dataFolder = "data/mentions"

	//go:embed skip-mentions.txt
	skipMentionsText string

	//go:embed skip-domains.txt
	skipDomainsText string
)

func main() {
	mentions, err := fetchMentions()
	if err != nil {
		log.Fatal(err)
	}

	skipMentions := make(map[int]bool)
	for _, line := range strings.Split(skipMentionsText, "\n") {
		if strings.HasPrefix(strings.TrimSpace(line), "#") {
			continue
		}
		if id, err := strconv.Atoi(line); err == nil {
			skipMentions[id] = true
		}
	}

	skipDomains := make(map[string]bool)
	for _, line := range strings.Split(skipDomainsText, "\n") {
		if strings.HasPrefix(strings.TrimSpace(line), "#") {
			continue
		}
		skipDomains[line] = true
	}

	for _, rawMention := range mentions {
		var m Mention
		if err := json.Unmarshal(rawMention, &m); err != nil {
			log.Printf("error decoding mention: %v", err)
			continue
		}

		if skipMentions[m.ID] {
			continue
		}

		source, err := url.Parse(m.Source)
		if err != nil {
			log.Printf("error parsing source URL %q: %v\n", m.Source, err)
			continue
		}

		if skipDomains[source.Host] {
			continue
		}

		target, err := url.Parse(m.Target)
		if err != nil {
			log.Printf("error parsing target URL %q: %v\n", m.Target, err)
			continue
		}

		if target.Host != "willnorris.com" && target.Host != "www.willnorris.com" && target.Host != "wjn.me" {
			log.Printf("target is for unexpected host: %v\n", target)
			continue
		}

		if target.Path == "" || target.Path == "/" {
			continue
		}

		file := mentionFile(m, dataFolder)
		if file == "" {
			log.Printf("unable to determine file for mention id: %v, target: %v\n", m.ID, m.Target)
			continue
		}
		if err := writeMention(rawMention, file); err != nil {
			log.Printf("error writing mention id: %v, target: %v: %v\n", m.ID, m.Target, err)
		}
	}
}

type Mention struct {
	ID     int    `json:"wm-id"`
	Target string `json:"wm-target"`
	Source string `json:"wm-source"`
}

func fetchMentions() ([]json.RawMessage, error) {
	token := os.Getenv("WEBMENTION_IO_TOKEN")
	if token == "" {
		return nil, fmt.Errorf("WEBMENTION_IO_TOKEN not set")
	}
	apiEndpoint := "https://webmention.io/api/mentions.jf2?per-page=1000&token=" + token

	resp, err := http.Get(apiEndpoint)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	type feed struct {
		Children []json.RawMessage `json:"children"`
	}
	f := new(feed)
	if err := json.NewDecoder(resp.Body).Decode(f); err != nil {
		return nil, err
	}

	return f.Children, nil
}

// regexp for /YYYY/MM/name path prefix
var reYearMonthPath = regexp.MustCompile(`^/(\d{4})/\d{2}/(.+)`)

func mentionFile(mention Mention, dataFolder string) string {
	if mention.ID == 0 {
		return ""
	}

	target, err := url.Parse(mention.Target)
	if err != nil {
		return ""
	}

	dir := reYearMonthPath.ReplaceAllString(target.Path, `$1/$2`)
	dir = strings.Trim(dir, "/")

	return filepath.Join(dataFolder, dir, strconv.Itoa(mention.ID)+".json")
}

func writeMention(mention json.RawMessage, file string) error {
	if err := os.MkdirAll(filepath.Dir(file), 0755); err != nil {
		return err
	}

	var buf bytes.Buffer

	enc := json.NewEncoder(&buf)
	enc.SetIndent("", "  ")
	enc.SetEscapeHTML(false)

	if err := enc.Encode(mention); err != nil {
		return err
	}

	return os.WriteFile(file, buf.Bytes(), 0644)
}
