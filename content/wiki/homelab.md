---
title: Homelab
---

{{<toc>}}

## IP Addresses

`10 . [vlan] . [device class] . [counter]`

### VLAN

| Value | Description |
| :---: | :---------- |
| 0     | Default <ul><li>Open connection to all local devices and public internet |
| 10    | IOT (Internet of Things) <ul><li>Connection only to other IOT devices (not other VLANs) <li>Open connection to public internet |
| 20    | NOT (Network of Things) <ul><li>No connection to other local devices<li>No connection to public internet |

### Device Class

| Value | Description |
| :---: | :---------- |
| 0     | Infrastructure - servers, switches, hubs |
| 1     | Personal devices - laptops, phones, kindles |
| 2     | Chromecasts, smart speakers, etc |
| 3     | Cameras |
| 4     | Appliances and other devices |
| 100   | DHCP range - all devices not otherwise assigned |

### Counter

No consistent pattern, though often grouped by device type, brand, or similar attribute.
