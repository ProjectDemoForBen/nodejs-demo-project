import React from 'react';

import './Image.css';
import config from "../../config";

const image = props => (
  <div
    className="image"
    style={{
      backgroundImage: `url('${config.backend}/${props.imageUrl}')`,
      backgroundSize: props.contain ? 'contain' : 'cover',
      backgroundPosition: props.left ? 'left' : 'center'
    }}
  />
);

export default image;
