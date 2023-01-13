package main

import (
	"path/filepath"
	"testing"
)

func TestMentionFile(t *testing.T) {
	tests := []struct {
		target  string
		wantDir string
	}{
		{
			target:  "https://willnorris.com/2000/01/name",
			wantDir: "2000:name",
		},
		{
			target:  "https://wjn.me/2000/01/name",
			wantDir: "2000:name",
		},
		{
			target:  "https://wjn.me/2000/name",
			wantDir: "2000:name",
		},
		{
			target:  "https://wjn.me/a/b",
			wantDir: "a:b",
		},
	}

	for _, tt := range tests {
		t.Run(tt.target, func(t *testing.T) {
			mention := Mention{ID: 123, Target: tt.target}
			got := mentionFile(mention, dataFolder)
			want := filepath.Join(dataFolder, tt.wantDir, "123.json")
			if got != want {
				t.Errorf("mentionFile(%q) = %q, want %q", tt.target, got, want)
			}
		})
	}
}
