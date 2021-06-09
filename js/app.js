
const d = document, 
   $form = d.getElementById('form-ingreso'),
   $tableTemplate = d.getElementById('tbody-template').content,
   $tableFragment = d.createDocumentFragment(),
   $table = d.querySelector('.users-table'),
   $tableBody = d.querySelector('.users-table__body');

const ajaxXHR = function(options) {
   const xhr = new XMLHttpRequest();
   const {method, url, success, error, data} = options;
   xhr.open(method,url);   
   xhr.setRequestHeader('content-type','application/json;charset=utf-8');
   xhr.send(JSON.stringify(data));

   xhr.addEventListener('readystatechange', (e) => {
      if(xhr.readyState != 4) {
         return;
      }      
      if(xhr.status >=200 && xhr.status < 300) {
         let data = JSON.parse(xhr.responseText);
         success(data);
      } else {
         let mensaje = xhr.statusText || 'Ha ocurrido un error';
         error(`Error: ${mensaje}`);
      }
   });

}

const ajaxFetch = function(options) {
   const {method, url, success, error, data} = options;
   fetch(url,{
      method,
      headers: {
         "content-type": "application/json; charset=utf-8"
      }, 
      body: JSON.stringify({
         nombre: data.nombre,
         identificacion: data.identificacion,
         edad: data.edad,
         telefono: data.telefono,
         genero: data. genero,
         profesion: data.profesion
      })
   })
      .then(res => {
         if(res.ok) {
            success(res.json());
         } else {
            Promise.reject("Se ha producido un error al intentar ingresar el nuevo usuario");
         }
      })
      .catch(err => {
         error(err);
      })
}

const ajaxAxios = function(options) {
   
}




const obtenerUsuarios = function() {
   const options = {
      method:'GET',
      url: 'http://localhost:3000/usuarios',
      success: function(data) {
         data.forEach(usuario => {
            $tableTemplate.querySelector('.template__id').textContent = usuario.id;
            $tableTemplate.querySelector('.template__nombre').textContent = usuario.nombre;
            $tableTemplate.querySelector('.template__identificacion').textContent = usuario.identificacion;
            $tableTemplate.querySelector('.template__edad').textContent = usuario.edad;
            $tableTemplate.querySelector('.template__telefono').textContent = usuario.telefono;
            $tableTemplate.querySelector('.template__genero').textContent = usuario.genero;
            $tableTemplate.querySelector('.template__profesion').textContent = usuario.profesion;

            const $btnEditar = $tableTemplate.querySelector('.btn-editar'),
                  $btnEliminar = $tableTemplate.querySelector('.btn-eliminar');
            
            $btnEditar.setAttribute('data-id', usuario.id);
            $btnEditar.setAttribute('data-nombre', usuario.nombre);
            $btnEditar.setAttribute('data-identificacion', usuario.identificacion);
            $btnEditar.setAttribute('data-edad', usuario.edad);
            $btnEditar.setAttribute('data-telefono', usuario.telefono);
            $btnEditar.setAttribute('data-genero', usuario.genero);
            $btnEditar.setAttribute('data-profesion', usuario.profesion);

            $btnEliminar.setAttribute('data-id', usuario.id);

            let $clone = d.importNode($tableTemplate, true);
            $tableFragment.append($clone);
         })
         $tableBody.appendChild($tableFragment);
      },
      error: function(error) {
         $table.insertAdjacentHTML('afterend', `<p><b>${error}</b></p>`)
      }, 
      data: null
   }
   ajaxXHR(options);
}

d.addEventListener('submit',function (event){
   if(event.target === $form) {   
      event.preventDefault();
      const id = $form.id.value,
            nombre = $form.nombre.value,
            identificacion = $form.identificacion.value,
            edad = $form.edad.value,
            telefono = $form.telefono.value,
            genero = $form.genero.value,
            profesion = $form.profesion.value,
            metodoAJAX = $form.opc_AJAX.value;
      if(!id) {
         //Operación --> CREATE
         switch (metodoAJAX) {
            case 'xhr':  
               ajaxXHR({
                  method:'POST',
                  url: 'http://localhost:3000/usuarios',
                  success: function(data) {
                     alert(`El usuario se ha creado correctamente!`);
                     location.reload();
                  },
                  error: function(mensaje) {
                     $table.insertAdjacentElement('afterend',`<p><b>${mensaje}</b></p>`)
                  },
                  data: {
                     nombre,
                     identificacion,
                     edad,
                     telefono,
                     genero,
                     profesion
                  }
               });
               break;
            case 'fetch':
                  ajaxFetch({
                     method:'POST',
                     url: 'http://localhost:3000/usuarios',
                     success: function(data) {
                        alert(`El usuario se ha creado correctamente!`);
                        location.reload();
                     },
                     error: function(mensaje) {
                        $table.insertAdjacentElement('afterend',`<p><b>${mensaje}</b></p>`);
                     },
                     data: {
                        nombre,
                        identificacion,
                        edad,
                        telefono,
                        genero,
                        profesion
                     }
                  });
               break;
            case 'axios':
                  //PENDIENTE POR HACER
               break;   
            default:
               console.log("Por favor elija un método para hacer AJAX");
               break;
         }
      } else {
         //Operación --> UPDATE
         switch (metodoAJAX) {
            case 'xhr':  
               ajaxXHR({
                  method:'PUT',
                  url: `http://localhost:3000/usuarios/${id}`,
                  success: function(data) {
                     alert(`El usuario se ha actualizado correctamente!`);
                     location.reload();
                  },
                  error: function(mensaje) {
                     $table.insertAdjacentElement('afterend',`<p><b>${mensaje}</b></p>`);
                  },
                  data: {
                     nombre,
                     identificacion,
                     edad,
                     telefono,
                     genero,
                     profesion
                  }
               });
               break;
            case 'fetch':
                  ajaxFetch({
                     method:'PUT',
                     url: `http://localhost:3000/usuarios/${id}`,
                     success: function(data) {
                        alert(`El usuario se ha actualizado correctamente!`);
                        location.reload();
                     },
                     error: function(mensaje) {
                        $table.insertAdjacentElement('afterend',`<p><b>${mensaje}</b></p>`);
                     },
                     data: {
                        nombre,
                        identificacion,
                        edad,
                        telefono,
                        genero,
                        profesion
                     }
                  });
               break;
            case 'axios':
               //PENDIENTE POR HACER
               break;   
            default:
               console.log("Por favor elija un método para hacer AJAX");
               break;
         }
      }
   }
});

d.addEventListener('click',(event) => {
   if(event.target.matches('.btn-editar')) {
      const $btnIngreso = d.getElementById('btn-ingreso');
      const $btnEditPresionado = event.target;
      $btnIngreso.value = "Editar Usuario";
      $form.id.value = $btnEditPresionado.dataset.id;
      $form.nombre.value = $btnEditPresionado.dataset.nombre;
      $form.identificacion.value = $btnEditPresionado.dataset.identificacion;
      $form.edad.value = $btnEditPresionado.dataset.edad;
      $form.telefono.value = $btnEditPresionado.dataset.telefono;
      $form.genero.value = $btnEditPresionado.dataset.genero;
      $form.profesion.value = $btnEditPresionado.dataset.profesion;
   } else if(event.target.matches('.btn-eliminar')) {
      const $btnElimPresionado = event.target,
            id = $btnElimPresionado.dataset.id;
      let confirmacion = window.confirm(`¿Desea eliminar al usuario con id: ${id}?`);
      if(confirmacion) {
         switch ($form.opc_AJAX.value) {
            case 'xhr':
               const options = {
                  method: 'delete',
                  url:`http://localhost:3000/usuarios/${id}`,
                  success: function(data) {
                     alert(`El usuario se ha eliminado correctamente!`);
                     location.reload();
                  },
                  error: function(mensaje) {
                     $table.insertAdjacentElement('afterend',`<p><b>Error al eliminar al usuario: ${mensaje}</b></p>`);
                  }
               }
               ajaxXHR(options);
               break;
            case 'fetch':
               fetch(`http://localhost:3000/usuarios/${id}`, {
                  method: "DELETE",
                  headers: {
                     "content-type": "application/json;chatset=utf-8"
                  }
               })
                  .then(res => {
                     alert(`El usuario se ha eliminado exitosamente`);
                     location.reload();
                  })
                  .catch(err => {
                     $table.insertAdjacentElement('afterend',`<p><b>Error al eliminar al usuario: ${mensaje}</b></p>`);
                  })
               break;
            case 'axios':

               break;   
            default:
               break;
         }
      }
   }
});

window.addEventListener('DOMContentLoaded', obtenerUsuarios());



