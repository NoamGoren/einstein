import React, {Component} from 'react';
import errors from './data.json';
import Collapse from 'react-css-collapse'


const restrictedErrorFields = ['Code', 'Type', 'Description'];
const restrictedExistingErrorFields = ['Code', 'Description'];

const emptyErrorObj = {
  itemInEdit: {
    Code: '',
    Type: '',
    Description: '',
    Actions: []
  },
  items: errors
}

class FormClass extends Component {

    constructor(props) {
        super(props);
        this.saveItem = this.saveItem.bind(this);
        this.onItemChange = this.onItemChange.bind(this);
        this.addStep = this.addStep.bind(this);
        this.addAction = this.addAction.bind(this);
        this.createNewError = this.createNewError.bind(this);

        this.state = {
            itemInEdit: emptyErrorObj.itemInEdit,
            items: emptyErrorObj.items,
            collapse : false
        }
    }

    onItemChange(key, e) {
      const itemInEdit = this.state.itemInEdit;
      itemInEdit[key] = e.target.value;

      this.setState({
        itemInEdit
      });

    }

    onStepItemChange(num, key, e) {
      const action = this.state.itemInEdit.Actions[num-1];
      action[key] = e.target.value;

       this.setState({
         itemInEdit: Object.assign({}, this.state.itemInEdit, {
           Actions: this.state.itemInEdit.Actions,
         })
       })
    }

    saveItem() {
      const errorIndex = this.state.items.findIndex(item => item.Code === this.state.itemInEdit.Code);
      if(errorIndex != -1)
      {
        this.state.items.splice(errorIndex, 1);
        this.state.items.splice(errorIndex, 0, this.state.itemInEdit);
         this.setState({
           items: this.state.items
         })
      }
      else {
        this.setState({
            items: this.state.items.concat({
                Code: this.state.itemInEdit.Code,
                Description: this.state.itemInEdit.Description,
                Type: this.state.itemInEdit.Type,
                Actions: this.state.itemInEdit.Actions,
                Steps: this.state.itemInEdit.Steps
            })
        });
      }

    }

    addStep(index){
      this.setState({
        itemInEdit: Object.assign({}, this.state.itemInEdit.Actions[index-1], {
          Steps: this.state.itemInEdit.Actions[index-1].Steps.concat({
            Title: '',
            Description: ''
          }),
        }),
      });
    }

    addAction(){
      this.setState({
        itemInEdit: Object.assign({}, this.state.itemInEdit, {
          Actions: this.state.itemInEdit.Actions.concat({
            Title: '',
            Link:'',
            Steps: []
          }),
        }),
      });
    }


    editError(code)
    {
       const editedError = this.state.items.findIndex(item => item.Code == code);
       if(editedError == -1)
       {
         console.log("couldn't find error code");
         return;
       }
       this.setState({
           itemInEdit: {
               Code: this.state.items[editedError].Code,
               Description: this.state.items[editedError].Description,
               Type: this.state.items[editedError].Type,
               Steps: this.state.items[editedError].Steps
           }
       });
    }

    createNewError()
    {
      this.setState({
        collapse: !this.state.collapse
      });
    }




    removeStep(index)
    {
      this.state.itemInEdit.Steps.splice(index-1, 1);
      this.setState({
        itemInEdit: Object.assign({}, this.state.itemInEdit, {
          Steps: this.state.itemInEdit.Steps
        }),
      });
    }

    removeAction(index)
    {
      this.state.itemInEdit.Actions.splice(index-1, 1);
      this.setState({
        itemInEdit: Object.assign({}, this.state.itemInEdit, {
          Actions: this.state.itemInEdit.Actions
        }),
      });
    }

    render() {
      const setNewItem = () => {
          let fields = [];
          Object.keys(emptyErrorObj.itemInEdit).forEach((key) => {
              const index = restrictedErrorFields.findIndex(name => name === key);
              index === -1 ? fields : fields.push(renderNewField(key));
          });
          return (
              <div className="section" key="fields">
                  {fields}
              </div>
          )
      };

            const renderNewField = (fieldKey) => {
              return (
                <div className="form-group" key={fieldKey}>
                  <label>{fieldKey}</label>
                  <input value={this.state.itemInEdit[fieldKey]} onChange={(e) => this.onItemChange(fieldKey, e)} className="form-control"></input>
                </div>
              );
            }

      const renderSteps = (actionIndex) => {
          var index = 0;
          return this.state.itemInEdit.Actions[actionIndex-1].Steps.map(step => {
              index++;
              let fields = [];
              Object.keys(step).forEach((key) => {
                  fields.push(renderStep(step, key, index))
              });
              return (
                <div className="section" key={"Step-"+index}>
                  {fields}
                  <button className="btn btn-default" onClick={this.removeStep.bind(this, index)}>Remove Step</button>
                </div>
              )
          })
      };

      const renderStep = (step, stepKey, index) => {
        return (
          <div className="form-group" key={"Step-"+stepKey+"-"+index}>
              <label>{stepKey}</label>
              <input value={step[stepKey]} onChange={this.onStepItemChange.bind(this, index, stepKey)} className="form-control"></input>
          </div>
        );
      }

      const renderActions = () => {
          var index = 0;
          return this.state.itemInEdit.Actions.map(action => {
              index++;
              let fields = [];
              Object.keys(action).forEach((key) => {
                  fields.push(renderAction(action, key, index))
              });
              return (
                <div className="section" key={"Action-"+index}>
                  {fields}
                  {renderSteps(index)}
                  <button className="btn btn-default" onClick={this.addStep(index)}>Add Step</button>
                  <br/>
                  <button className="btn btn-default" onClick={this.removeAction.bind(this, index)}>Remove Action</button>
                </div>
              )
          })
      };

      const renderAction= (action, actionKey, index) => {
        if(actionKey!='Steps'){
          return (
            <div className="form-group" key={"Action-"+actionKey+"-"+index}>
                <label>{actionKey}</label>
                <input value={action[actionKey]} onChange={this.onStepItemChange.bind(this, index, actionKey)} className="form-control"></input>
            </div>
          );}
        }

        return (
          <div>
            <div className="h5">
                <i class="fas fa-info-circle fa-3x mr-2" ></i>
                Error {this.props.code} does not exists in our system</div>
            <button className="btn btn-default w-100 col-xs-12 frame" onClick={()=>{this.createNewError()}} >Type here to add</button>
            <Collapse isOpen={this.state.collapse}>
              <div className="col-xs-12">
                 <div className="section">
                      <hr />
                      {setNewItem()}
                      <label>Actions</label>
                      <div className="stepsContainer form-group">
                        {renderActions()}
                      </div>
                      <div className="form-group">
                        <button className="btn btn-default" onClick={this.addAction}>Add Action</button>
                      </div>
                      <div className="form-group">
                          <button className="btn btn-default" onClick={this.saveItem}>Save</button>
                      </div>
                    </div>
                </div>
            </Collapse>
          </div>
        )
    }
}


export default FormClass;
