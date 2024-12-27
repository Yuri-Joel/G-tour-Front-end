

export const Formattime = (time) => {
    const date = new Date(time)
    const formattedDate = `${Time(date.getDate())}/${ Time(date.getMonth() + 1)}/${date.getFullYear()}`;
    const formattedTime = `${Time(date.getHours())}:${Time(date.getMinutes())}:${Time(date.getSeconds())}`;

    return `${formattedTime} ${formattedDate} `
}


export  const  Time = (time)=>{

    if(time <= 9){
        const newtime = 0+""+time
        
         return newtime
    }
        return time;  
}