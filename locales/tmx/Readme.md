# Translate using Etranslation

## PO files
Generate latest po files before start the translation process in order to have the latest version.

## Convert PO to TMX

Use the english language file to convert using a online convertor.

* english file  ../volto-cca-policy/locales/en/LC_MESSAGES/volto.po
* online tmx convertor https://localise.biz/free/converter/po-to-xliff

## Etranslation
Generate TMX files using etranslation.
Copy the response from eTranslation to : ...../volto-cca-policy/locales/tmx/data/

## Update PO files

```sh
cd ...../volto-cca-policy/locales/tmx
python run.py
```

The updates will be visible only after we restart the web server
