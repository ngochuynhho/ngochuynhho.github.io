# WHO growth reference data

The CSV files in `csv/` are the sex-specific WHO Child Growth Standards LMS
tables distributed by the U.S. Centers for Disease Control and Prevention,
National Center for Health Statistics. They cover birth through 24 months for
weight-for-age, length-for-age, and head-circumference-for-age, plus 45–110 cm
for weight-for-length.

Official source and original downloads:

- https://www.cdc.gov/growthcharts/who-data-files.htm
- https://www.who.int/tools/child-growth-standards/standards

`who-lms.js` is generated from the first four columns of those CSV files by
`../../scripts/build-who-data.py`. Each row is:

```text
[ageMonthsOrLengthCm, L, M, S]
```

Source: WHO Child Growth Standards (2006), World Health Organization; data
distributed by CDC/NCHS. WHO and CDC do not endorse Little Days. The original
data are available free of charge from WHO and CDC.

Accessed August 24, 2026.
