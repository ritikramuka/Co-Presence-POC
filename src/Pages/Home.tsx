import React from 'react'
import { useHistory } from 'react-router-dom';
import { createFluidFile } from '../Utils/ContainerUtils';

const Home = () => {
  const history = useHistory();
  const handleClick = async () => {
    const filePath = await createFluidFile();
    history.push(filePath);
  };

  return (
    <div>
      Let's Start the Demo
      <button onClick = {handleClick}>Start</button>
    </div>
  )
}

export default Home