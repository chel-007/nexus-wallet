import React, { useCallback, useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { W3SSdk } from '@circle-fin/w3s-pw-web-sdk';
import { SVGLoader, PasswordEye } from './SVGIcon';
import axios, { AxiosError } from 'axios';
import './ToastContainer.css';
import 'react-toastify/dist/ReactToastify.css';

interface CraftingProps {}

let sdk: W3SSdk;

interface UserData {
    id: string;
  }

const Crafting: React.FC<CraftingProps> = () => {

    useEffect(() => {
        sdk = new W3SSdk()
      }, [])

      return(
        <div>hey</div>
      )
}

export default Crafting;