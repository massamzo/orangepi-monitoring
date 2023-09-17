import subprocess
 
#returns the temperature --> (int)

def commandExecuter(command):
    comm = subprocess.run(command, shell=True, capture_output=True, text=True)
    return comm.stdout

def getCpuTemp():
    temp  = commandExecuter("cat /sys/class/thermal/thermal_zone0/temp")
    temp = int(temp)
    temp /= 1000
    return int(temp)


#returns an array ---> [free ram, used ram]
def getRamValues():
    memoryDetails = commandExecuter("free")
    memoryDetails = memoryDetails.split("\n")

    
    memoryDetails = memoryDetails[1].split(" ")
    
    newDetails = []

    for elem in memoryDetails:
        if(elem.isdigit()):
            newDetails.append(elem)
        if(len(newDetails) == 2):
            break


    #tranforming them into numbers

    for i in range(len(newDetails)):
        
        newDetails[i] = float(newDetails[i])/1000000
        

    newDetails[0] = round(newDetails[0]-newDetails[1], 2)
    newDetails[1] = round(newDetails[1],2)
    return newDetails



#returns an array with disk storage info --> [available space, used space, total]
def getDiskStrorage():
    spaceInfo = commandExecuter("df /root")
    spaceInfo = spaceInfo.split("\n")

    
    spaceInfo = spaceInfo[1].split(" ")

    
    newDetails = []

    for elem in spaceInfo:
        if(elem.isdigit()):
            newDetails.append(elem)
        if(len(newDetails) == 2):
            break
    

    for i in range(len(newDetails)):
        
        newDetails[i] = round(float(newDetails[i])/1000000, 2)


    newDetails.append(newDetails[0])
    newDetails[0] = round(newDetails[0]-newDetails[1], 2)
    newDetails[1] = round(newDetails[1],2)
    
    return newDetails


#returns the ips with an array ---> [local ip, public ip]
def getIp():

    localip = commandExecuter("hostname -I | awk '{print $1}'")
    localip = localip.split("\n")[0]

    #getting the public ip
    publicIp = commandExecuter("curl ifconfig.me")
    


    return [localip, publicIp]
    

def rebooter(password):
    localpswd = "massam123@"

    if(password == localpswd):
        #reboot

        res = commandExecuter("reboot")
    else:
        return "PASSWORD DOESN'T MATCH"
        

def shutdown(password):
    localpswd = "massam123@"

    if(password == localpswd):
        #reboot

        res = commandExecuter("shutdown -h now")

    else:
        return "PASSWORD DOESN'T MATCH"


