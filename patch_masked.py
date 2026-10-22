with open('src/pages/dashboard/AddUCCPage.tsx', 'r', encoding='utf-8') as f:
    lines = f.readlines()

# line index 28 is the stray "};\n"
del lines[28]

with open('src/pages/dashboard/AddUCCPage.tsx', 'w', encoding='utf-8') as f:
    f.writelines(lines)

print("Done. Lines:", len(lines))
print("Around fix:", repr(''.join(lines[25:32])))
