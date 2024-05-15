import xml.etree.ElementTree as ET
import json
import polib
import os
import shutil

currentPath = os.getcwd()

path = currentPath + "/data/"
tmxFiles = os.listdir(path)
tmxFiles = list(filter(lambda x: '.tmx' in x, tmxFiles))
print(tmxFiles)


poPath = currentPath+'/..'

def getData(fileName):
    tree = ET.parse('./data/'+fileName)
    root = tree.getroot()
    response = {'language':[], 'data':{}}
    for body in root.findall("body"):
        for tu in body.findall("tu"):
            temp = {}
            for tuv in tu.findall("tuv"):
                attributes = tuv.attrib
                first_key = list(attributes)[0]
                language = attributes[first_key][0:2]
                key = tuv.find("seg").text
                temp[language] = key
                if language!='en' and language not in response['language']:
                    response['language'].append(language.lower())

            en_key = temp['en']
            del temp['en']
            response['data'][en_key]=temp
    return response


def translate(json, language):
    if not os.path.isdir(poPath+'/'+language):
        os.mkdir(poPath+'/'+language)
    if not os.path.isdir(poPath+'/'+language+'/LC_MESSAGES'):
        os.mkdir(poPath+'/'+language+'/LC_MESSAGES')

    poFile = poPath+'/'+language+'/LC_MESSAGES/volto.po'
    if not os.path.isfile(poFile):
        shutil.copyfile(poPath+'/en/LC_MESSAGES/volto.po', poFile)

    po = polib.pofile(poFile)
    for entry in po:
        if entry.msgid in json and language in json[entry.msgid]:
            entry.msgstr = json[entry.msgid][language]
    po.save(poFile)


for fileName in tmxFiles:
    jsonData = getData(fileName)

    for language in jsonData['language']:
        print("LANGUAGE:"+language)
        translate(jsonData['data'], language)