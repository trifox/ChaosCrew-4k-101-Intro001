// in LatLongInput.js
import { useController } from 'react-hook-form';
import { Labeled, useEditContext,NumberInput } from 'react-admin'
import { Stack, styled, StackProps, TextField, Theme, Typography,Grid } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import PlayIcon from '@mui/icons-material/PlayArrow';
import UpIcon from '@mui/icons-material/ArrowCircleUp';
import DownIcon from '@mui/icons-material/ArrowCircleDown';
import LeftIcon from '@mui/icons-material/ArrowCircleLeft';
import RightIcon from '@mui/icons-material/ArrowCircleRight';
import PauseIcon from '@mui/icons-material/Pause';
import ComplexNumberEdit from './ComplexNumberEdit';
import { MouseEventHandler, useEffect, useRef } from 'react';

export const NumberEditArrows: React.FC<{ source: string }> = ({ source }) => {
    const useScale=true;
    const { field: field1 } = useController({ name: source }); 
    // const { field: zoomScale } = useController({ name: 'zoomStartEnd[0]' });
    //  console.log('Fields are',field1,field2,zoomScale)

 const mouseDown=useRef(false)  
 const mouseDownLocation=useRef({x:0,y:0,ox:0,oy:0})  
 const elementRef = useRef<HTMLDivElement>(null);

const mouseUpHandler=(e:MouseEvent)=>{
   // console.log('mouseup')
    document.removeEventListener('mousemove',mouseMoveHandler)
    document.removeEventListener('mouseup', mouseUpHandler)
    e.preventDefault()
    e.stopImmediatePropagation()
    e.stopPropagation()
}
const mouseMoveHandler= (e:MouseEvent ) => {
    // console.log( 'mousemove',{left: e.pageX, top: e.pageY },elementRef.current?.getBoundingClientRect());  
    const relx=mouseDownLocation.current.x-e.pageX  
    const rely=e.pageY-mouseDownLocation.current.y
    // console.log( 'mousemove relative' , relx/100,rely/100); 
    field1.onChange(mouseDownLocation.current.ox+(relx/100) )  
 //   setState( {left: e.pageX, top: e.pageY });  
    e.preventDefault()
    e.stopImmediatePropagation()
    e.stopPropagation()

}

const mouseDownHandler=(e:MouseEvent )=>{
    const rect=elementRef.current?.getBoundingClientRect()
    if(rect){
    mouseDownLocation.current.x=e.pageX
    mouseDownLocation.current.y=e.pageY
    mouseDownLocation.current.ox=field1.value 
mouseDown.current=true
    document.addEventListener('mousemove',mouseMoveHandler)
    document.addEventListener('mouseup', mouseUpHandler)
    e.preventDefault()
    e.stopImmediatePropagation()
    e.stopPropagation()
    }
}
useEffect(()=>{
    // destructor free document listener
    return ()=>{
        
    document.removeEventListener('mousemove',mouseMoveHandler)
    document.removeEventListener('mouseup', mouseUpHandler)
    }
},[])

    return ( <Grid container>
         
                <Grid item xs={8}>
        <ComplexNumberEdit source={source}></ComplexNumberEdit>
        </Grid>
      
        <Grid item xs={4}>
        <ClickDiv ref={elementRef}
          /* @ts-ignore */
        onMouseDown={mouseDownHandler as MouseEventHandler}
        > </ClickDiv>
    
           

            </Grid> 
            </Grid>
    );
}; 
const ClickDiv=styled('div')`
background-color:red;
width:100px;
height:100px;
`

const Container=styled('div')`
display:flex
`