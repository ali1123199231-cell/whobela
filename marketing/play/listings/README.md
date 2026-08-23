# Play store listings

One JSON file per Play language code. `check.py` validates them, `publish.py`
pushes them.

```
python3 check.py            # field limits, in UTF-16 units like Play counts
python3 publish.py --dry-run
python3 publish.py
```

## Access — currently blocked

`publish.py` returns **HTTP 403** on `com.whobela.app` (verified 2026-08-23).
The service account authenticates fine and Google issues a token; the grant is
scoped to `com.ocroon.app` only.

To unblock: **Play Console → Users and permissions → Invite new user**, add
`firebase-adminsdk-fbsvc@ocroon.iam.gserviceaccount.com` with **Manage store
presence** on `com.whobela.app`. The old *Setup → API access* page is retired
and bounces to the app list; *Linked services* is Ads/Firebase/Analytics and is
not this.

Until then these files can be pasted into the Console by hand — they are the
finished copy either way.

## Why these words

Written from Semrush keyword research (2026-08-23), not translated. Translating
the English listing walks into two verified traps, so don't.

| Locale | Built on | Volume | KD | Avoided, and why |
|---|---|---|---|---|
| en-US | `ask someone out` | 24,590 | 22% | `date invitation` / `date invite` — one identical cluster, 65,670 volume but owned by wedding "save the date" (6,600/mo) and Apple event dates. Also avoids bare `date`, which lands in the dating-app pool the app explicitly is not in. |
| de-DE | `erstes Date` | 73,430 | **19%** | Lowest difficulty of any market measured. Noise is the film "50 erste Dates". |
| fr-FR | `premier rendez-vous` | 3,980 | 24% | The literal `inviter quelqu'un à sortir` has **zero** volume — verified dead. Noise is the TV show "Mariés au premier regard". |
| es-ES / es-419 | `invitar a salir` | — | — | **Never lead with `cita`.** `primera cita` is 75,460 volume dominated by `cita previa DNI` — booking a national ID appointment, 8,100/mo. In Spanish "cita" reads as bureaucracy, not romance. |
| pl-PL | `pierwsza randka pomysły` | 4,680 | **13%** | Easiest single term found anywhere. Noise is a TVP programme. |
| pt-BR | `chamar para sair` | 52,410 | 27% | `primeiro encontro` is contaminated by the Warcraft film and by catechism classes. |

Ranking on Play is per-locale, so each file is its own keyword surface. That is
the whole reason they are rewritten rather than translated.

## Conventions

- Play language codes are **not** uniformly `xx-YY`: `pl-PL` and `es-419` are
  qualified, while `et`, `lv`, `uk` are bare. Name each file exactly what Play
  calls the locale or the push 404s.
- Graphics are deliberately not uploaded. Play falls back to the default
  language's screenshots and feature graphic, which is what we want.
- `es-ES` uses peninsular forms (`habléis`, `móvil`); `es-419` uses `vos`/
  `celular`/`película` and says `app de citas` where Spain says `app de ligar`.
