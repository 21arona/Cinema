import React from "react";

const InputComponent = ({ name, divClassName, imageSrc, imageAlt, imageClassName, type, placeholder, inputClassName, onChange}) => (
    <div className={divClassName}>
<i className={imageClassName}></i>
    <input type={type} placeholder={placeholder} className={inputClassName} onChange={onChange} name= {name}/>
  </div>

)

export default InputComponent