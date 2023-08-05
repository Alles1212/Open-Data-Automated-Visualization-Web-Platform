from flask_wtf import FlaskForm
from wtforms import StringField, TextAreaField, SelectField, SubmitField
from flask_wtf.file import FileField, FileAllowed, FileRequired
from wtforms.validators import DataRequired
# from application import uploadData
import os

class TodoForm(FlaskForm):
    name = StringField("Name", validators=[DataRequired()])
    description = TextAreaField("Description", validators=[DataRequired()])
    completed = SelectField("Completed", choices = [("False", "False"), ("True", "True")]
                            ,validators=[DataRequired()])
    submit = SubmitField("Add Project")
