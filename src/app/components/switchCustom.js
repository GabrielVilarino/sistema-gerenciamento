import { styled } from "@mui/material/styles";
import Switch from "@mui/material/Switch";

const CustomSwitch = styled(Switch)(({ theme }) => ({
  '& .MuiSwitch-switchBase.Mui-checked': {
    color: '#741518', // bolinha
    '&:hover': {
      backgroundColor: 'rgba(116, 21, 24, 0.08)', // efeito hover
    },
  },
  '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
    backgroundColor: '#741518', // trilho
  },
  '& .MuiSwitch-track': {
    backgroundColor: '#ccc', // trilho desligado
  },
}));

export default CustomSwitch;