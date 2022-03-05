from flask import *
import mysql.connector
from mysql.connector import Error
import json

app=Flask(__name__)
app.config["JSON_AS_ASCII"]=False
app.config["TEMPLATES_AUTO_RELOAD"]=True

#資料庫連線
db = mysql.connector.connect(
  host="localhost",
  user = "root",
  password = "12345678",
  database = "TaipeiData",
)

cursor = db.cursor()
print("連線成功")


@app.route("/api/attractions",methods=['GET'])
def attractions():
	# 從網址上得到資料page 跟 keyword
	page = int(request.args.get("page",0))
	keyword = request.args.get("keyword",None)
	try:
		
		# 第一種狀況 page=0 & keyword=none
		# keyword=none 所以page=0
		if keyword == None:
			pageCount = page*12
			sqlAllDate = "SELECT * FROM `viewList` LIMIT %s, 12;" % pageCount
			cursor.execute(sqlAllDate)
			allResult = cursor.fetchall()
			cursor.reset()
			# print(type(allResult))
	
			# 抓出景點資料list 存 {"nextPage":next_page, "data":[{data}]}
			imageList = []  #image先裝進list 再裝進dict
			viewList=[]
			for i in allResult:
				viewDict={}
				viewDict["id"]=i[0]
				viewDict["name"] = i[1]
				viewDict["category"] = i[2]
				viewDict["description"] = i[3]
				viewDict["address"] = i[4]
				viewDict["transport"] = i[5]
				viewDict["mrt"] = i[6]
				viewDict["latitude"] = i[7]
				viewDict["longitude"] = i[8]
				imageList.append(i[9])
				viewDict["images"] = imageList
				viewList.append(viewDict)

			# page =0 但next_page=1
			# 抓出全部資料
			sqlData = "SELECT COUNT(*) FROM `viewList`;" 
			cursor.execute(sqlData)
			TotalCount = cursor.fetchone()
			cursor.reset()
			# 抓出總數但型態是tuple
			# print("總數:",TotalCount)
			pageCount = TotalCount[0]//12

			if page < pageCount:
				next_page = page+1
			else:
				next_page = None,

			# Responses
			return jsonify({"nextPage":next_page, "data":viewList})

		#keyword 有值 做景點搜尋
		else:
			#先抓資料 跳過幾筆 然後一次抓12筆
			sqlSearch=f"SELECT * FROM `viewList` where name like '%{keyword}%'LIMIT {page*12}, 12;"
			cursor.execute(sqlSearch)
			searchResult = cursor.fetchall()
			cursor.reset()
			
			sqlCountNum = "SELECT COUNT(*) FROM `viewList` where name like '%{keyword}%';"
			cursor.execute(sqlCountNum)
			sqlCountNumResult = cursor.fetchone()
			cursor.reset()

			searchCount=sqlCountNumResult[0]//12
			if page < searchCount:
				next_page = page+1
			else:
				next_page = None

			# 一樣的步驟
			searchimageList = [] 
			searchList=[]
			for j in searchResult:
				searchDict={}
				searchDict["id"]=j[0]
				searchDict["name"] = j[1]
				searchDict["category"] = j[2]
				searchDict["description"] = j[3]
				searchDict["address"] = j[4]
				searchDict["transport"] = j[5]
				searchDict["mrt"] = j[6]
				searchDict["latitude"] = j[7]
				searchDict["longitude"] = j[8]
				searchimageList.append(j[9])
				searchDict["images"] = searchimageList
				searchList.append(searchDict)

			print(searchList)
			# Responses
			return jsonify({"nextPage":next_page, "data":searchList})

	except:
		errorStauts="status"+'='+'500'
		return jsonify({"error": True, "message": "伺服器內部錯誤"}),errorStauts

@app.route("/api/attraction/<attractionId>",methods=['GET'])
def attractionsID(attractionId):
	sqlSearchId = f"SELECT * FROM `viewList` WHERE id ={attractionId};"
	cursor.execute(sqlSearchId)
	searchId = cursor.fetchall()
	cursor.reset()

	try:
		if searchId != []:
			for x in searchId:
				IdData = {}
				IdData["id"]= x[0]
				IdData["name"]=x[1]
				IdData["category"]=x[2]
				IdData["description"]=x[3]
				IdData["address"]=x[4]
				IdData["transport"]=x[5]
				IdData["mrt"]=x[6]
				IdData["latitude"]=x[7]
				IdData["longitude"]=x[8]
				IdData["images"] = x[9]

			DataMessage = jsonify({"data":IdData})
			return DataMessage
			
		else:
			errorIdStatus = jsonify({"error": True ,"messgae":"無此編號"})
			return errorIdStatus
	except:
		erroridStauts="status"+'='+'500'
		return jsonify({"error": True, "message": "伺服器內部錯誤"}),erroridStauts


# Pages
@app.route("/")
def index():
	return render_template("index.html")

@app.route("/attraction/<id>")
def attraction(id):
	return render_template("attraction.html")

@app.route("/booking")
def booking():
	return render_template("booking.html")

@app.route("/thankyou")
def thankyou():
	return render_template("thankyou.html")


app.run( port=3000)

