import mysql.connector
import pymysql
import json
import re

db = mysql.connector.connect(
  host="localhost",
  user = "root",
  password = '12345678',
  database = "TaipeiData",
  auth_plugin='mysql_native_password'
  )
cursor = db.cursor(buffered=True)
print("連線成功")

#第一種寫法
# f = open('taipei-attractions.json',encoding="utf8")
# data = json.load(f)
# print(data)
# f.close()
 
#第二種寫法
with open('taipei-attractions.json',encoding="utf8") as f:
    data = json.load(f)

# print(type(data))
# print(data['result']['results'][1])
# 抓取資料
for i in data['result']['results']:
    name = i['stitle']
    category = i['CAT2']
    description = i['xbody']
    address = i['address']
    transport = i['info']
    mrt = i['MRT']
    latitude = float(i['latitude']) #字串 新增資料庫要轉
    longitude = float(i['longitude'])
    testImages = i["file"]
    filter = re.compile(r'(https?://[^, "]*?\.(?:jpg|png|jpeg|JPG))')
    images = filter.findall(testImages)
    sqlinstruction = """
        INSERT INTO viewList (name,category,description,address,transport,mrt,latitude,longitude,images) 
        VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s)
    """
    viewData = (str(name),str(category),str(description),str(address),str(transport),str(mrt),latitude,longitude,str(images))
    # print(name,category,description,address,transport,mrt,latitude,longitude,images)
    cursor.execute(sqlinstruction,viewData)
    db.commit()
print("新增成功")




