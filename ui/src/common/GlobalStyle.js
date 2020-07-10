import { createGlobalStyle } from "styled-components";
import { normalize } from "styled-normalize";

export default createGlobalStyle`
  ${normalize}
  
  /****** Elad Shechter's RESET *******/
  /*** box sizing border-box for all elements ***/
  *,
  *::before,
  *::after{box-sizing:border-box;}
  a{text-decoration:none; color:inherit; cursor:pointer;}
  button{background-color:transparent; color:inherit; border-width:0; padding:0; cursor:pointer;}
  figure{margin:0;}
  input::-moz-focus-inner {border:0; padding:0; margin:0;}
  ul, ol, dd{margin:0; padding:0; list-style:none;}
  h1, h2, h3, h4, h5, h6{margin:0; font-size:inherit; font-weight:inherit;}
  p{margin:0;}
  cite {font-style:normal;}
  fieldset{border-width:0; padding:0; margin:0;}
  
  //*,*:focus,*:hover{
   // outline:none;
  //}

  /****** Typography *******/
  html{ 
   height: 100vh;
   font-size: 1px;/*for using REM units*/
  }
  body{
    height: 100vh;
    font-family: 'Public Sans',sans-serif;
    font-size: 16rem;
    font-weight: 400;
    line-height: 1.3;
    color: #222;
  }
  
  #root {
    height: 100vh;
  }
  
  .pt-1 {
  padding-top: 10rem;
  }
`;
