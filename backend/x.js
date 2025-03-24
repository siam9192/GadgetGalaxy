const convertExceptedDeliveryDate = (rangeHours)=>{
    if(rangeHours.includes('-')){
      const [min,max] =  rangeHours.split('') 
      const from =  new Date()
      from.setHours(from.getHours()+Number(min))
      const to  = new Date()
      to.setHours(to.getHours()+Number(max))
      
      return {
        from,
        to
      }
    }
    const inDate =  new Date()
    inDate.setHours(inDate.getHours()+Number(rangeHours))
    return {
      in:inDate
    }
  
  }
  
