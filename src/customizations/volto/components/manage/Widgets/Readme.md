Original: https://github.com/plone/volto/blob/16.x.x/src/components/manage/Widgets/ArrayWidget.jsx

The issue can be reproduce in the metadata section block. The Select widget from the edit sidebar steals the focus when you try to edit a slate text after you edit the Select widget in the metadata section block. 
The quick solution was to comment the "autoFocus" prop in the Select component (see the customization part in ArrayWidget.jsx, line 321).
This is a temporary fix until it is properly tested and fixed the issue in this ticket: https://taskman.eionet.europa.eu/issues/268852 