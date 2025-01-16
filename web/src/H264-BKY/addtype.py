import os

# 当前文件夹路径
folder_path = os.getcwd()

# 遍历文件夹中的所有 Markdown 文件
for file_name in os.listdir(folder_path):
    if file_name.endswith(".md"):
        file_path = os.path.join(folder_path, file_name)

        # 读取文件内容
        with open(file_path, "r", encoding="utf-8") as file:
            lines = file.readlines()

        # 判断是否已经有 type: book-zh-cn
        if any(line.startswith("type: book-zh-cn") for line in lines):
            print(f"{file_name}: 已存在 type: book-zh-cn，跳过")
            continue

        # 找到 YAML Front Matter 的结束行并插入新行
        for i, line in enumerate(lines):
            if line.strip() == "---" and i > 0:  # 第二个 "---" 表示 Front Matter 结束
                lines.insert(i, "type: book-zh-cn\n")
                break

        # 写回文件
        with open(file_path, "w", encoding="utf-8") as file:
            file.writelines(lines)

        print(f"{file_name}: 已添加 type: book-zh-cn")
