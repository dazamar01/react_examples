import axios from '../../axios';
import * as at from './actionTypes';
import * as CONSTANTES from '../../shared/constantes';
import { CONS_VAL_ORDENIA } from '../../shared/constantesOrdenia';

// ----------------------------------------------------- Funciones Báiscas

export const procesoIniciado = () => {
  return {
    type: at.ORD_SET_PROCESO_INICIADO
  }
};

export const procesoFinalizado = () => {
  return {
    type: at.ORD_SET_PROCESO_FINALIZADO
  }
};

export const procesoError = (error) => {
  return {
    type: at.ORD_SET_PROCESO_ERROR,
    error: error
  }
};

export const mostrarOcultarMensaje = (mostrarMensaje, tipoMensaje, mensaje) => {
  return {
    type: at.ORD_ADMINISTRAR_MENSAJE,
    mostrarMensaje, tipoMensaje, mensaje
  };
}

export const updFecha = (fecha, semana) => {
  return {
    type: at.ORD_UPD_FECHA,
    fecha: fecha,
    semana: semana
  };
}

export const setPesadaNoEncontrada = (pesadaNoEncontrada) => {
  return {
    type: at.ORD_PESADA_NO_ENCONTRADA,
    pesadaNoEncontrada
  };
}

// ----------------------------------------------------- Funciones SIMPLES

// ----------------------------------------------------- Manipulación de datos en memoria


export const setData = (ordeniaId, fechaCaptura, data, lote, motivosSecado, gruposProductivos, loteDestinoDefault) => {

  return {
    type: at.ORD_SET_DATA,
    ordeniaId, fechaCaptura, data, lote, motivosSecado, gruposProductivos, loteDestinoDefault
  };
}


export const marcarAnimalSecado = (marcarSecado, registroSeleccionado, fn) => {
  return {
    type: at.ORD_MARCAR_ANIMAL_SECADO,
    marcarSecado, registroSeleccionado, fn
  };
}


/*
export const setUbicacionCompleta = (ubicacionCompleta) => {
  console.log('ubicacionCompleta', ubicacionCompleta);
  return {
    type: at.ORD_SET_UBICACION_COMPLETA,
    ubicacionCompleta
  }
}
*/

// ----------------------------------------------------- Manipulación de datos de/hacia BD

export const fetchSemanaPorFecha = (fecha) => {
  return dispatch => {
    dispatch(procesoIniciado());
    //const url = '/ordenia/getSemanaPorFechaCaptura/?fechaCaptura=' + fecha;
    const url = '/common/getSemanaPorFechaCaptura/?fechaCaptura=' + fecha;

    axios.get(url, { headers: { Authorization: localStorage.getItem('token') } })
      .then((response) => {
        dispatch(procesoFinalizado());
        if (response.data.length === 0) {
          dispatch(updFecha(fecha, ''));
        } else {
          dispatch(updFecha(
            fecha, response.data));
        }
      }).catch(error => {
        console.log('fetchSemanaPorFecha', error);
        dispatch(procesoError(true));
      });
  }
}

export const fetchFechaOrdenia = (loteId) => {
  return dispatch => {
    dispatch(procesoIniciado());
    const url = '/controlordenia/getControlFechaOrdeniaByLote/?l=' + loteId;
    axios.get(url, { headers: { Authorization: localStorage.getItem('token') } })
      .then((response) => {
        dispatch(procesoFinalizado());

        if (response.data.length === 0) {
          dispatch(updFecha('', ''));
        } else {
          dispatch(updFecha(
            response.data.fechaUltimaCaptura === null ? '' : response.data.fechaProximaCaptura,
            response.data.semana === null ? '' : response.data.semana + 1));
        }
      }).catch(error => {
        dispatch(procesoError(error));
      });
  }
}

// DESECHAR
export const setMsgFechaMuyDistante = (value) => {
  return {
    type: at.ORD_FECHA_MUY_DISTANTE,
    value
  }
}

export const onConfirmarFechaMuyDistante = (loteId, fecha, confirmar) => {
  return dispatch => {
    dispatch(setMsgFechaMuyDistante(false));
  }
}
export const setConfirmarFechaMuyDistante = (loteId, fecha, confirmar, fnSuccess) => {
  return dispatch => {
    dispatch(setMsgFechaMuyDistante(false));
    if (confirmar) {
      dispatch(setMsgFechaMuyDistante(false));
      let confirmarFechaDistante = 1;
      dispatch(generarProcesoCaptura(loteId, fecha, fnSuccess, confirmarFechaDistante));
    }
  }
}
// DESECHAR


export const validarProcesoCaptura = (loteId, fecha, fnCancelar, fnContinuar) => {
  const url = '/controlordenia/validar/?loteId=' + loteId
    + '&fechaCaptura=' + fecha;

  let msg = 'Este lote no se ha registrado como "Lote de ordeña". Regístrelo primero';

  return dispatch => {
    dispatch(procesoIniciado());
    axios.get(url, { headers: { Authorization: localStorage.getItem('token') } })
      .then((response) => {

        dispatch(procesoFinalizado());

        let params;

        console.log('response.data', response.data);

        switch (response.data) {

          case CONS_VAL_ORDENIA.INVALIDA_SECADO_CURSO:
            msg = 'Se tiene un proceso de secado en curso. Imposible continuar';
            dispatch(mostrarOcultarMensaje(true, CONSTANTES.ALERT_TIPO_MSG.WARNING, msg));
            break;

          case CONS_VAL_ORDENIA.INVALIDA_MUY_DISTANTE:
            // dispatch(setMsgFechaMuyDistante(true));
            params = {
              resultadoValidacion: CONS_VAL_ORDENIA.INVALIDA_MUY_DISTANTE
            };
            fnContinuar(params);
            break;

          case CONS_VAL_ORDENIA.VALIDA:
            params = {
              resultadoValidacion: CONS_VAL_ORDENIA.VALIDA
            };
            fnContinuar(params);
            break;

          case CONS_VAL_ORDENIA.INVALIDA_LOTE:
            msg = 'Lote de captura no válido.';
            dispatch(mostrarOcultarMensaje(true, CONSTANTES.ALERT_TIPO_MSG.WARNING, msg));
            break;

          case CONS_VAL_ORDENIA.VALIDA_CAPTURA_PENDIENTE:
            params = {
              resultadoValidacion: CONS_VAL_ORDENIA.VALIDA_CAPTURA_PENDIENTE
            };
            fnContinuar(params);
            break;

          case CONS_VAL_ORDENIA.INVALIDA_INACTIVA:
            msg = 'Este lote se encuentra inactivo. Actívelo primero.';
            dispatch(mostrarOcultarMensaje(true, CONSTANTES.ALERT_TIPO_MSG.WARNING, msg));
            break;

          case CONS_VAL_ORDENIA.INVALIDA_FECHA:
            msg = 'Existe otra captura mas reciente. Verifique.';
            dispatch(mostrarOcultarMensaje(true, CONSTANTES.ALERT_TIPO_MSG.WARNING, msg));
            break;

          default:
            console.log('DESCONOCIDA');
        }

      }).catch(error => {
        console.log(error);
        dispatch(procesoError(true));
      });
  }

}





// METODOS FINALIZADOS

export const generarProcesoCaptura = (loteId, fecha, fnSuccess, confirmarFechaDistante) => {

  return dispatch => {

    dispatch(procesoIniciado());

    let url = '/ordenia/?loteId=' + loteId
      + '&fechaCaptura=' + fecha
      + '&generarCaptura=' + 1;

    if (confirmarFechaDistante !== undefined) {  // Se utiliza en la función "setConfirmarFechaMuyDistante"
      if (confirmarFechaDistante === 1) {
        url += '&confirmacion=' + 1;
      }
    }

    axios.get(url, { headers: { Authorization: localStorage.getItem('token') } })
      .then((response) => {

        if (fnSuccess !== undefined) {
          fnSuccess();
        }

      }).catch(error => {
        console.error('generarProcesoCaptura', error);
        dispatch(mostrarOcultarMensaje(true, 3, CONSTANTES.MSG_ERROR_INESPERADO));
        dispatch(procesoError(true));
      });
  };
}

export const setInformacionCaptura = (loteId, fecha, informacionCaptura) => {
  return {
    type: at.ORD_SET_INFORMACION_CAPTURA,
    loteId, fecha, informacionCaptura
  };
}

export const getInformacionCaptura = (loteId, fecha, fnSuccess) => {
  return dispatch => {

    dispatch(procesoIniciado());

    let url = '/ordenia/datosCaptura/?loteId=' + loteId
      + '&fechaCaptura=' + fecha;

    axios.get(url, { headers: { Authorization: localStorage.getItem('token') } })
      .then((response) => {

        console.log('response.data', response.data);
        dispatch(setInformacionCaptura(loteId, fecha, response.data));

        dispatch(procesoFinalizado());

        if (fnSuccess !== undefined) {
          fnSuccess(2); // encabezado
        }

      }).catch(error => {
        console.error('getProcesoCaptura', error);
        if (error.response === undefined) {
          dispatch(mostrarOcultarMensaje(true, 3, CONSTANTES.MSG_ERROR_INESPERADO));
        } else {
          if (error.response.status === 500) {
            dispatch(mostrarOcultarMensaje(true, 3, CONSTANTES.MSG_ERROR_PROCESO));
          } else {
            if (error.response.status === 409) {
              dispatch(setPesadaNoEncontrada(true))
            }
          }

        }

        dispatch(procesoError(true));
      });

  }
}

export const getProcesoCaptura = (loteId, fecha, fn, fnActualizarData, filtrarSoloSecado) => {

  return dispatch => {

    dispatch(procesoIniciado());

    let url = '/ordenia/?loteId=' + loteId
      + '&fechaCaptura=' + fecha;

    if (filtrarSoloSecado === true) {
      url += '&filtrarSecado=1';
    }

    // console.log('url', url);
    axios.get(url, { headers: { Authorization: localStorage.getItem('token') } })
      .then((response) => {

        // console.log('response', response);

        const data = response.data.listaRegistros;
        const ordeniaId = response.data.ordeniaCapturaId;
        const fechaCaptura = response.data.fechaCaptura;
        const lote = response.data.lote;
        const motivosSecado = response.data.motivosSecado;
        const gruposProductivos = response.data.gruposProductivos;
        const loteDestinoDefault = response.data.loteDestinoDefault;

        dispatch(setData(ordeniaId, fechaCaptura, data, lote, motivosSecado, gruposProductivos, loteDestinoDefault));

        dispatch(procesoFinalizado());

        if (fn !== undefined) {
          fn(2);  //Setear el titulo
          fnActualizarData(1, data);  //Actualizar los datos de captura del state
        }


      }).catch(error => {
        console.error('getProcesoCaptura', error);
        if (error.response === undefined) {
          dispatch(mostrarOcultarMensaje(true, 3, CONSTANTES.MSG_ERROR_INESPERADO));
        } else {
          if (error.response.status === 500) {
            dispatch(mostrarOcultarMensaje(true, 3, CONSTANTES.MSG_ERROR_PROCESO));
          } else {
            if (error.response.status === 409) {
              dispatch(setPesadaNoEncontrada(true))
            }
          }
        }

        dispatch(procesoError(true));
      });
  };
}

export const actualizarStateVacas = (vacas) => {
  return {
    type: at.ORD_UPD_STATE_VACAS,
    vacas
  };
}

export const salvarAvance = (loteId, datos, funcionError, funcionSuccess, devolverData) => {

  return dispatch => {
    dispatch(procesoIniciado());

    const url = '/ordenia/' + loteId;

    const header = { Authorization: localStorage.getItem('token') };
    let data = {
      'animalesPorSalvar': datos
    }

    axios.put(url, data, { headers: header })
      .then((response) => {

        if (devolverData === false) {  // Es captura de ordeña
          dispatch(actualizarStateVacas(response.data));
          funcionSuccess(); // Solo ejecutar la funcion, sin devolver los datos del response
        } else {
          // Es captura de secado
          funcionSuccess(response.data)
        }


        dispatch(procesoFinalizado());

      }).catch(error => {
        console.log('Error guardando proceso', error);

        dispatch(procesoError(true));
        funcionError();

      });


  }
}

export const finalizarProceso = (loteId, fechaCaptura, produccionLecheSemanal, produccionLecheDia, fnFinalizado) => {

  const url = '/ordenia/';
  const header = { Authorization: localStorage.getItem('token') };

  let data = {
    'produccionLecheSemanal': produccionLecheSemanal, 'produccionLecheDia': produccionLecheDia,
    'fechaCaptura': fechaCaptura,
    'lote': {
      'id': loteId
    }
  }

  return dispatch => {
    dispatch(procesoIniciado());

    axios.post(url, data, { headers: header })
      .then((response) => {

        if (fnFinalizado !== undefined) {
          fnFinalizado();
        }

      }).catch(error => {
        console.error('finalizarProceso', error);
      });
    // dispatch(finalizarCaptura());
  }
}


export const eliminarCapturaTemporal = (loteId, fechaCaptura, fnSuccess) => {

  const url = '/ordenia/eliminarCapturaTemporal/?loteId=' + loteId;
  return dispatch => {

    dispatch(procesoIniciado());

    axios.get(url, { headers: { Authorization: localStorage.getItem('token') } })
      .then((response) => {

        if (fnSuccess !== undefined) {
          fnSuccess();
        }

      }).catch(error => {
        console.log(error);
        dispatch(procesoError(true));
      });
  }
}

export const setInformacionCapturaPendiente = (capturaPendiente) => {
  return {
    type: at.ORD_SET_DATOS_CAPTURA_PENDIENTE,
    capturaPendiente
  };
}

export const buscarInformacionCapturaPendiente = (loteId, fechaCaptura, fnSuccess) => {
  const url = '/ordenia/getDatosCapturaPendiente/?loteId=' + loteId + '&fechaCaptura=' + fechaCaptura;
  return dispatch => {

    axios.get(url, { headers: { Authorization: localStorage.getItem('token') } })
      .then((response) => {

        console.log('response.data', response.data);

        dispatch(setInformacionCapturaPendiente(response.data))

        if (fnSuccess !== undefined) {
          fnSuccess();
        }

      }).catch(error => {
        console.log(error);
        dispatch(procesoError(true));
        dispatch(mostrarOcultarMensaje(true, 3, CONSTANTES.MSG_ERROR_PROCESO));
      });

  }
}


export const procesarCapturaOrdenia = (loteId, fechaCaptura, nombreArchivo, fnError, fnSuccess) => {

  const url = '/ordenia/procesarCapturaDesdeArchivo/?loteId=' + loteId
    + '&fechaCaptura=' + fechaCaptura + '&nombreArchivo=' + nombreArchivo;

  return dispatch => {

    dispatch(procesoIniciado());

    axios.get(url, { headers: { Authorization: localStorage.getItem('token') } })
      .then((response) => {

        if (fnSuccess !== undefined) {
          fnSuccess();
        }

      }).catch(error => {
        console.log('procesarCapturaOrdenia', error);

        if (error.response === undefined) {
          dispatch(mostrarOcultarMensaje(true, 3, CONSTANTES.MSG_ERROR_INESPERADO));
        } else {
          if (error.response.status === 500) {
            dispatch(mostrarOcultarMensaje(true, 3, CONSTANTES.MSG_ERROR_PROCESO_CARGA_CAPTURA_ORDEÑA));
            if (fnError !== undefined) {
              fnError();
            }
          } else {
            if (error.response.status === 409) {
              dispatch(mostrarOcultarMensaje(true, 2, CONSTANTES.MSG_ERROR_PROCESO_ARCHIVO_INVALIDO));
            }
          }
        }

      });



  }
}


export const descargarPlantilla = (loteId, fechaCaptura) => {

  const url = '/ordenia/exportarCaptura/?loteId=' + loteId
    + '&fechaCaptura=' + fechaCaptura;

  return dispatch => {

    dispatch(procesoIniciado());

    axios.get(url,
      {
        headers: { Authorization: localStorage.getItem('token') },
        responseType: 'blob'
      })
      .then((response) => {

        //FileSaver.saveAs(response.data, effectiveFileName);

        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'catura-'+fechaCaptura+'.xlsx'); //or any other extension
        document.body.appendChild(link);
        link.click();

        dispatch(procesoFinalizado());

      }).catch(error => {

        dispatch(procesoFinalizado());

        if (error.response === undefined) {
          dispatch(mostrarOcultarMensaje(true, 3, CONSTANTES.MSG_ERROR_INESPERADO));
        } else {
          if (error.response.status === 500) {
            dispatch(mostrarOcultarMensaje(true, 3, CONSTANTES.MSG_ERROR_PROCESO_CARGA_CAPTURA_ORDEÑA));

          } else {
            if (error.response.status === 409) {
              dispatch(mostrarOcultarMensaje(true, 2, CONSTANTES.MSG_ERROR_PROCESO_ARCHIVO_INVALIDO));
            }
          }
        }

      });



  }
}