import os
import re

# 当前文件夹路径
folder_path = os.getcwd()

# 匹配图片路径的正则
image_pattern = re.compile(r'!\[\]\(([^/]+/[^)]+)\)')

# 遍历文件夹中的所有 Markdown 文件
for file_name in os.listdir(folder_path):
    if file_name.endswith(".md"):
        file_path = os.path.join(folder_path, file_name)

        # 读取文件内容
        with open(file_path, "r", encoding="utf-8") as file:
            content = file.read()

        # 替换图片路径
        new_content = image_pattern.sub(r'![](img/\1)', content)

        # 如果内容发生变化，写回文件
        if new_content != content:
            with open(file_path, "w", encoding="utf-8") as file:
                file.write(new_content)
            print(f"{file_name}: 已更新图片路径")
        else:
            print(f"{file_name}: 无需更新")
