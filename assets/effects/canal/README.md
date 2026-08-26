# Canal Effects Package

The first Canal slice uses small 3-6-frame shared loops, not unique animation for every object.

| Effect | Frames | Trigger | Layer |
| --- | ---: | --- | --- |
| `water-calm` | 4 | Always | Behind guests |
| `steam-chimney` | 4 | Always when the workshop is operating | Effect |
| `steam-aufguss` | 6 | Scheduled outdoor Gus | Effect |
| `shower-water` | 4 | Guest rinse | Front of guest |
| `plunge-ripple` | 4 | Guest enters/plunges | Behind guest |
| `plunge-splash` | 3 | Entry/exit only | Front of guest |
| `construction-steam` | 4 | Active construction project | Effect |
| `repair-work` | 4 | Active technician repair | Effect |

Effect source frames must not contain buildings, people or baked UI. The scene provides the position, while the effect provides only the motion.
