//Library Imports:
import React from 'react'


//Optimizer Slice Redux Functionality: 
import { restriction_switch, restriction_body_interpret, 
  restriction_body_edit, splice_one, push_one, edit_one, edit_key} from '../../redux/features/optimizerSlice'

const OptimizeParameter = ({parameter, callbackDispatch, weighted, requestBody}) => {

  //? `weighed` prop indicates if this instance is just a Checkbox, or a Checkbox along with a Slider to indicate the parameter's weight.

  //Turns strings like "77" into a float weight between 0 & 1 (0.77)
  const weightDecode = (i) => {
    return parseInt(i)/100;
  }

  // ^ Reverts that  
  const weightEncode = (i) => {
    return (i*100).toString(10);
  }

  const editKeyWrap = (key,value) => {
    //If weighted is true, use the `optimizer_criteria` nest string, else nullify
      let nest = weighted ? "optimizer_criteria" : null;
      callbackDispatch( edit_key({ nest , key ,  value }) );
  }

  //TODO: INTEGRATE SLIDER and Display Text for UI component

  React.useEffect(
    () => { 

    } , [] 
  );

  const renderParameter = () => {
    
    // checkbox ternary based on parameter logic eXpression
    const checkboxEval = (logic) => { 
      
      const checkboxTrue = <input type="checkbox" className="form-check-input" 
      onChange={ (e) => editKeyWrap(parameter, e.target.checked) }  defaultChecked
      /> ;

      const checkboxFalse = <input type="checkbox" className="form-check-input" 
      onChange={ (e) => editKeyWrap(parameter, e.target.checked) } 
      />;

      return logic ? checkboxTrue : checkboxFalse;
    }

    //Un-initalized until re-assigned
    let checkboxJSX;
    let sliderJSX;

    if(weighted) {

      //Ternary checking the parameter in req body object's `optimizer_criteria` key which is also an object.
      checkboxJSX = checkboxEval(requestBody["optimizer_criteria"][parameter]);

      // Create associated slider (for inputting weight of param, if it's a weighted param)
      sliderJSX = <input type="range" min="1" max="100" step="1" className="slider" 
        defaultValue={weightEncode(requestBody["optimizer_criteria"][parameter+"_weight"])} 
        id={parameter+'_slide'}
        onChange={(e) => {editKeyWrap( parameter+"_weight" , weightDecode(e.target.value) )}}
      />
    } else {
      //Non weighted options aren't in nested in a key, so this ternary is just req body object check
      checkboxJSX = checkboxEval(requestBody[parameter]);
    }
    
    return <div>
      {parameter}
      {checkboxJSX}
      {sliderJSX}
    </div>
  }

  return renderParameter();
}

export default OptimizeParameter;