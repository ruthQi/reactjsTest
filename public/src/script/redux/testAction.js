

export const actionType = {
   CHANGE_NAME: 'changeName'
}

function changeName(name){
   return{
      type: actionType.CHANGE_NAME,
      name

   }
}

export default {
   changeName
}