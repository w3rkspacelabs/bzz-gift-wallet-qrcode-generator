import csv
import os 
import sys

def trim_0x_prefix(value):
    if value.startswith("0x"):
        return value[2:]
    return value

def empty_dir(dir="./qrcodes/"):
    os.system("rm -rf " + dir)
    os.system("mkdir qrcodes")

def save_qr():
    if len(sys.argv) < 2:  # Since sys.argv[0] is the script name, we expect at least 2 elements
        raise ValueError("No CSV wallet file passed. Please provide the path to csv wallet")
    # file_path = 'wallets/wallets-1719830289619.csv', generate file with `node index.js`
    file_path =  sys.argv[1] 
    i = 1
    with open(file_path, mode='r', newline='') as file:
        csv_reader = csv.reader(file)
        for row in csv_reader:
            print( str(i).zfill(4), trim_0x_prefix(row[1]) )
            os.system(f"qrcode -w 128 -t svg -o qrcodes/{str(i).zfill(4)}.svg {trim_0x_prefix(row[1])}") 
            i = i+1

def make_html_page():
    html = '<html><head><title>QR Codes</title><link rel="stylesheet" type="text/css" href="../styles.css"></head><body>'
    images = os.listdir('qrcodes')
    sortedimages = sorted(images)
    for image in sortedimages:
        html += f'<img src="{image}" />'
    html += "</body></html>"
    with open('qrcodes/qrcodes.html', 'w') as file:
        file.write(html)
    print("HTML page generated - qrcodes.html")

empty_dir()
save_qr()
make_html_page()