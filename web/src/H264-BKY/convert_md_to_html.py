import os
import re

# 将 Markdown 图片标签转换为 HTML 图片标签
def convert_markdown_to_html(file_path):
    with open(file_path, 'r', encoding='utf-8') as file:
        content = file.read()

    # 使用正则表达式匹配 Markdown 图片语法并替换为 HTML 格式
    content = re.sub(
        r'!\[\]\((.*?)\)',  # 匹配 `![](path)` 格式
        r'<img alt="" src="\1">',  # 替换为 `<img alt="" src="path">`
        content
    )

    with open(file_path, 'w', encoding='utf-8') as file:
        file.write(content)

# 遍历当前目录中的 Markdown 文件
def process_all_md_files_in_dir(directory):
    for root, _, files in os.walk(directory):
        for file_name in files:
            if file_name.endswith('.md'):
                file_path = os.path.join(root, file_name)
                print(f"Processing: {file_path}")
                convert_markdown_to_html(file_path)

# 执行脚本
if __name__ == "__main__":
    current_directory = os.getcwd()  # 当前目录
    process_all_md_files_in_dir(current_directory)
