import json
from flask import Flask, jsonify, render_template, request, url_for, redirect
from processes import *

app = Flask(__name__)
 
@app.route("/")
def main():
    ips = getIp()
    return render_template("index.html", ipAddr=ips, temp=getCpuTemp())

@app.route("/memory", methods=["GET", "POST"])
def memoryDetails():
    if(request.method == "POST"):
        memoryDetails = getRamValues()

        data = {
            "data":memoryDetails
        }

        return jsonify(data)
    
    return redirect(url_for("main"))
    
@app.route("/diskspace", methods=['GET', 'POST'])
def diskDetails():
    if(request.method == "POST"):
        diskDetails = getDiskStrorage()

        data = {
            "data" : diskDetails
        }

        return jsonify(data)
    
    return redirect(url_for("main"))


@app.route("/reboot", methods=['GET', 'POST'])
def reboot():
    if(request.method == "POST"):
        data = request.data
        data = data.decode("utf-8")
        data = json.loads(data)


        return rebooter(data['password'])
    
    return redirect(url_for("main"))


@app.route("/turnoff", methods=['GET', 'POST'])
def turnoff():
    if(request.method == "POST"):
        data = request.data
        data = data.decode("utf-8")
        data = json.loads(data)


        return shutdown(data['password'])
    
    return redirect(url_for("main"))

if "__main__" == __name__ :
    app.run(host="0.0.0.0", debug=True)