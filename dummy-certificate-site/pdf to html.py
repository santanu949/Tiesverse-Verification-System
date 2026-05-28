import fitz

doc = fitz.open(r"C:\Users\User\Downloads\_TIES Offer Letter 2.0.pdf")

html = ""

for page in doc:
    html += page.get_text("html")

with open("output.html", "w", encoding="utf-8") as f:
    f.write(html)

print("Done")