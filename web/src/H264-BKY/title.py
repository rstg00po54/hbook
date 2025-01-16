import os
import glob
import re

# 提取并确保一级标题格式正确（如果#后面没有空格，就加上）
def extract_first_level_header(md_content):
    # 使用正则表达式匹配一级标题（以 # 开头）
    match = re.search(r'^(#)(\S.*)', md_content, re.MULTILINE)
    if match:
        # 如果 # 后面没有空格，添加一个空格
        corrected_line = match.group(1) + ' ' + match.group(2) if match.group(2) else match.group(1)
        # 将修改后的内容替换回原文中
        md_content = md_content.replace(match.group(0), corrected_line, 1)
        return corrected_line, md_content
    return None, md_content

# 生成元数据头部
def generate_md_header(title, order=0):
    return f'---\ntitle: {title}\ntype: book-zh-cn\norder: {order}\n---\n'

# 处理每个 Markdown 文件
def process_md_file(file_path):
    # 读取原始 Markdown 文件内容
    with open(file_path, 'r', encoding='utf-8') as f:
        md_content = f.read()
    
    # 提取一级标题并修正格式
    title, updated_content = extract_first_level_header(md_content)
    
    if title:
        # 生成相应的元数据并将其写入文件开头
        header = generate_md_header(title)
        
        # 将元数据添加到文件开头并保存到新文件
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(header)
            f.write(updated_content)
        print(f"文件 {file_path} 处理完成！")
    else:
        print(f"文件 {file_path} 没有找到一级标题或不需要修改！")

# 遍历当前文件夹中的 .md 文件
def traverse_md_files(directory):
    # 获取当前文件夹下的所有 .md 文件
    md_files = glob.glob(os.path.join(directory, "*.md"))
    
    if not md_files:
        print("当前文件夹没有找到 .md 文件。")
    
    for md_file in md_files:
        process_md_file(md_file)

# 获取当前工作目录
current_directory = os.getcwd()

# 遍历当前目录中的 .md 文件并处理
traverse_md_files(current_directory)
