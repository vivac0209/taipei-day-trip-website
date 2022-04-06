from flask import *
import mysql.connector
from mysql.connector import Error
import pymysql
import json
import re
from flask_cors import CORS

app=Flask(__name__)
CORS(app)
app.config["JSON_AS_ASCII"]=False
app.config["TEMPLATES_AUTO_RELOAD"]=True
app.secret_key="qqqqq"
#資料庫連線
db = mysql.connector.connect(
  host="localhost",
  user = "root",
  password = "12345678",
  database = "taipeidata",
)

cursor = db.cursor()
print("連線成功")

# 註冊
@app.route("/api/user",methods=['POST'])
def signup():
	regData = request.get_json()
	regName = regData['name']
	regEmail = regData['email']
	regrPws = regData['password']
	print(regName,regEmail,regrPws)

	try:
		sqlActionQuery =  "SELECT * FROM `memberList` WHERE `email`= '%s' " % regEmail
		cursor.execute(sqlActionQuery)
		searchEmail = cursor.fetchone()
		print(searchEmail)

		if searchEmail != None:
			cursor.reset()
			print("信箱已被註冊")
			return jsonify({"error":True,"message":"信箱已被註冊"})
					
		else:
			sqlActionAdd = """
			INSERT INTO `memberList` (name,email,password)
			VALUES(%s,%s,%s);
			"""
			sqlValue = (regName,regEmail,regrPws)
			cursor.execute(sqlActionAdd,sqlValue)
			db.commit()
			cursor.reset()
					
			print("新增成功")
			return jsonify({"ok": True})
	except:
		return jsonify({"error":True,"message":"伺服器內部錯誤"})
#登入
@app.route("/api/user",methods=['PATCH'])
def Login():
	LoginData = request.get_json()

	LoginEmail = LoginData['email']
	LoginPws = LoginData['password']
	# print(LoginEmail,LoginPws)

	try:
		sqlFound =  "SELECT * FROM `memberList` WHERE `email`= '%s'" % LoginEmail
		cursor.execute(sqlFound)
		emailResult = cursor.fetchone()
		# print(emailResult)
			
		
		if emailResult != None:
			pwsData = emailResult[3]
			# print(pwsData)
			if pwsData == LoginPws:
				# print("test")
				session["email"] = LoginEmail
				session["id"] = emailResult[0]
				session["name"] = emailResult[1]
					
				cursor.reset()
				return jsonify({"ok":True})
			else:
				cursor.reset()
				return jsonify({"error":True,"message":"密碼輸入錯誤"})
		else:
			cursor.reset()
			return jsonify({"error":True,"message":"找不到此帳號"})
		
	except:
		return jsonify({"error":True,"message":"伺服器內部錯誤"})

@app.route("/api/user",methods=['GET'])
def checkLogin():

	if "email" in session:
		return jsonify(
			{"data":
			{	"id":session["id"],
				"name":session["name"],
				"email":session["email"],
			}
		})
	else:
		return jsonify({"data":None})

@app.route("/api/user",methods=['DELETE'])
def Logout():
	session.pop("id", None)
	session.pop("name", None)
	session.pop("email", None)
	return jsonify({"ok":True})
###############################################################
@app.route("/api/booking",methods=['GET'])
def Getbooking():
	try:
		if "email" in session:
			print("app test")
			nameID = session["id"]

			salsearchName = f"SELECT * FROM `Newbooking` WHERE `member_id`= '{nameID}';"
			cursor.execute(salsearchName)
			searchName = cursor.fetchone()
			cursor.reset()
			# print(searchName)

			if searchName == None:
				return jsonify({"data": None})
			else:
				attractionID = searchName[1]
				sqlSearchBooking = f"SELECT * FROM `viewList` WHERE `id`= '{attractionID}';"
				cursor.execute(sqlSearchBooking)
				SearchBookingResult = cursor.fetchone()
				cursor.reset()
				# print(SearchBookingResult)

				testImages = SearchBookingResult[9]
				filter = re.compile(r'(https?://[^, "]*?\.(?:jpg|png|jpeg|JPG))')
				images = filter.findall(testImages)
				filterImages = images[0]
				print(searchName[3])
				# checkTime = searchName[3]
				# if checkTime == "morning":
				# 	timeMsg = "早上九點到下午四點"
				# else:
				# 	timeMsg = "下午兩點到下午八點"

				# print(timeMsg)

				return jsonify(
					{"data": {
						"attraction": {
						"id": SearchBookingResult[0],
						"name": SearchBookingResult[1],
						"address": SearchBookingResult[4],
						"image": filterImages
						},
						"date": searchName[2],
						"time": searchName[3],
						"price": searchName[4]
					}
				})
		else:
			return jsonify({"error":True,"message":"尚未登入"})
		
	except:
		return jsonify({"error":True,"message":"伺服器內部錯誤"})

@app.route("/api/booking",methods=['POST'])
def Postbooking():
	try:
		if "email" not in session:
			return jsonify({"error":True,"message":"尚未登入"})
		else:
			Postbooking = request.get_json()
			attraction_id = Postbooking['attractionId']
			PostbookingData = Postbooking['date']
			PostbookingTime = Postbooking['time']
			PostbookingPrice = Postbooking['price']

			print(attraction_id,PostbookingData,PostbookingTime,PostbookingPrice)
			
			if PostbookingData == "" or PostbookingTime == "":
				return jsonify({"error":True,"message":"尚未選擇日期或是時間"})
			else:
				PostnameID = session["id"]
				salPostbooking = f"SELECT * FROM `Newbooking` WHERE member_id = '{PostnameID}';"
				cursor.execute(salPostbooking)
				PostbookingResult = cursor.fetchone()
				cursor.reset()
				print(PostbookingResult)

				if PostbookingResult == None:
					sqladd = f"""
					INSERT INTO Newbooking (member_id,attraction_id,data,time,price)
					VALUES('{PostnameID}','{attraction_id}','{PostbookingData}','{PostbookingTime}','{PostbookingPrice}');
					"""
					cursor.execute(sqladd)
					db.commit()
					cursor.reset()
					print("INSERT")
					return jsonify({"ok":True})
				else:
					sqlUpdate = f"""
					UPDATE `Newbooking` 
					SET attraction_id='{attraction_id}',data='{PostbookingData}',time='{PostbookingTime}',price='{PostbookingPrice}'
					WHERE member_id = '{PostnameID}';
					"""
					cursor.execute(sqlUpdate)
					db.commit()
					cursor.reset()
					print("update")
					return jsonify({"ok":True})
	except:
		return jsonify({"error":True,"message":"伺服器內部錯誤"})

@app.route("/api/booking",methods=['DELETE'])
def Deletebooking():
	# try:
	if "email" not in session:
		return jsonify({"error":True,"message":"尚未登入"})
	
	else:
		delNameID = session["id"]
		salDeltbooking = "DELETE FROM `Newbooking` WHERE member_id = '%s';" % delNameID
		cursor.execute(salDeltbooking)
		return jsonify({"ok":True})

###############################################################
@app.route("/api/attractions",methods=['GET'])
def attractions():
	# 從網址上得到資料page 跟 keyword
	page = int(request.args.get("page",0))
	keyword = request.args.get("keyword",None)

	try:
		# 第一種狀況 page=0 & keyword=none
		# keyword=none 所以page=0
		if keyword == None:
			sqlData = "SELECT COUNT(*) FROM `viewList`;" 
			cursor.execute(sqlData)
			TotalCount = cursor.fetchone()
			cursor.reset()
			# 抓出總數但型態是tuple
			# print("總數:",TotalCount)
			pageCount = TotalCount[0]//12
			
			if page > pageCount:
				next_page = None
			
			elif page == pageCount:
				next_page = None
			else:
				next_page = page+1
				# viewList = None

			pageCount = page*12
			sqlAllDate = "SELECT * FROM `viewList` LIMIT %s, 12;" % pageCount
			cursor.execute(sqlAllDate)
			allResult = cursor.fetchall()
			cursor.reset()
			# print(type(allResult))
				# 抓出景點資料list 存 {"nextPage":next_page, "data":[{data}]}
			
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
				
				imageList =  i[9]
				filter = re.compile(r'(https?://[^, "]*?\.(?:jpg|png|jpeg|JPG))')
				arr = filter.findall(imageList)
				arrResult=[]
				for a in arr:
					arrResult.append(a)
					# print(type(arrResult))
				# print(arrResult)

				viewDict["images"] = arrResult
				viewList.append(viewDict)
			
			# print(viewDict["images"])
			
			#Responses
			return jsonify({"nextPage":next_page, "data":viewList})

			#keyword 有值 做景點搜尋
		else:
				#先抓資料 跳過幾筆 然後一次抓12筆
			sqlSearch=f"SELECT * FROM `viewList` WHERE name LIKE '%{keyword}%' or '%{keyword}' or '{keyword}%' LIMIT {page*12}, 12;"
			cursor.execute(sqlSearch)
			searchResult = cursor.fetchall()
				
			sqlCount =f"SELECT COUNT(*) FROM `viewList` WHERE name LIKE '%{keyword}%' OR '%{keyword}' OR '{keyword}%';"
			cursor.execute(sqlCount)
			sqlCountResult = cursor.fetchall()
			
			# print(type(sqlCountResult))
			# print(sqlCountResult[0][0])
			cursor.reset()
			sreuslt = (sqlCountResult[0][0])//12
			if page < sreuslt:
				next_page = page+1
			else:
				next_page = None

				# 一樣的步驟
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

				imageList1 = j[9]
				filter = re.compile(r'(https?://[^, "]*?\.(?:jpg|png|jpeg|JPG))')
				arr1 = filter.findall(imageList1)
				arrResult1=[]
				for b in arr1:
					arrResult1.append(b)
					
				searchDict["images"] = arrResult1
				searchList.append(searchDict)

			# print(searchList)
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

				imageList2 =  x[9]
				filter = re.compile(r'(https?://[^, "]*?\.(?:jpg|png|jpeg|JPG))')
				arr2 = filter.findall(imageList2)
				arrResult2=[]
				for c in arr2:
					arrResult2.append(c)

				IdData["images"] = arrResult2

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

app.run(host='0.0.0.0', port=3000)
