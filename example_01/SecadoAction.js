import axios from '../../axios';
import * as at from './actionTypes';
import * as commons from '../../shared/commonUtility';
import * as CONSTANTES from '../../shared/constantes';

// ---------------------------------------------------------------- BASICS
export const procesoIniciado = () => {
  return {
    type: at.SEC_SET_PROCESO_INICIADO
  }
};

export const procesoFinalizado = () => {
  return {
    type: at.SEC_SET_PROCESO_FINALIZADO
  }
};

export const procesoError = (error) => {
  return {
    type: at.SEC_SET_PROCESO_ERROR,
    error: error
  }
};

export const mostrarOcultarMensaje = (mostrarMensaje, tipoMensaje, mensaje) => {
  return {
    type: at.SEC_ADMINISTRAR_MENSAJE,
    mostrarMensaje, tipoMensaje, mensaje
  };
}

// ---------------------------------------------------------------- BASICS-END

export const setLoteCaptura = (loteCaptura) => {
  return {
    type: at.SEC_SET_LOTE_CAPTURA,
    loteCaptura
  }
};

export const setFechaCaptura = (fechaCaptura) => {
  return {
    type: at.SEC_SET_FECHA_CAPTURA,
    fechaCaptura
  }
};

export const setSemanaCaptura = (semanaCaptura) => {
  return {
    type: at.SEC_SET_SEMANA_CAPTURA,
    semanaCaptura
  }
};

export const setPesadaNoEncontrada = (value) => {
  return {
    type: at.SEC_SET_PESADA_NO_ENCONTRADA,
    value
  }
};

export const setCatalogos = (motivosSecado, gruposProductivos, loteDestinoDefault) => {
  return {
    type: at.SEC_SET_CATALOGOS,
    motivosSecado, gruposProductivos, loteDestinoDefault
  }
}

export const setFechaEncontrada = (fechaEncontrada) => {
  return {
    type: at.SEC_SET_FECHA_ENCONTRADA,
    fechaEncontrada
  }
}

export const setAnimales = (animales) => {
  return {
    type: at.SEC_SET_ANIMALES,
    animales
  }
}

export const eliminarSecado = (loteId, fnSuccess) => {
  return dispatch => {
    dispatch(procesoIniciado());
    const url = '/secado/' + loteId;
    const header = { Authorization: localStorage.getItem('token') };
    axios.delete(url, { headers: header })
      .then((response) => {
        if (response.status === 200) {
          if (fnSuccess !== undefined) {
            fnSuccess();
          }
        } else {
          dispatch(procesoError(true));
        }
      }).catch(error => {
        console.error('eliminarSecado', error);
        dispatch(procesoError(true));
      });
  }
}

export const fetchFechaCaptura = (fechaCaptura) => {
  return dispatch => {
    dispatch(procesoIniciado());

    dispatch(setFechaCaptura(fechaCaptura));

    commons.getSemanaPorFecha(fechaCaptura)
      .then(semana => {
        dispatch(setSemanaCaptura(semana));
        dispatch(procesoFinalizado());
      }, error => {
        dispatch(procesoError(true));
        dispatch(mostrarOcultarMensaje(true, CONSTANTES.ALERT_TIPO_MSG.DANGER, CONSTANTES.MSG_ERROR_INESPERADO));
        console.error('SecadoAction.fetchFechaCaptura', error);
      });
  }
}

export const validarProcesoSecado = (loteId, fechaCaptura, fnInvalido, fnEvaluarStep) => {
  return dispatch => {

    dispatch(procesoIniciado());

    const url = '/secado/validarCaptura/?loteId=' + loteId;
    axios.get(url, { headers: { Authorization: localStorage.getItem('token') } })
      .then((response) => {

        dispatch(procesoFinalizado());

        if (response.data.valida === false) {
          if (fnInvalido !== undefined) {
            fnInvalido();
          }
        } else {
          // Es valida... verificar si no hay captura pendiente
          if (response.data.valida && response.data.secadoEnProceso === false) {
            if (fnEvaluarStep !== undefined) {
              fnEvaluarStep(CONSTANTES.SECADO_STEPS.CONTINUAR_LISTAR_ANIMALES);
            }
          } else {
            if (response.data.valida && response.data.secadoEnProceso === true) {
              // mostrar las opciones para listar, eliminar o cancelar
              dispatch(setFechaEncontrada(response.data.fechaCaptura))
              fnEvaluarStep(CONSTANTES.SECADO_STEPS.SECADO_EN_PROCESO);
            }
          }
        }

      }).catch(error => {
        console.error('validarCaptura', error);
        dispatch(mostrarOcultarMensaje(true, CONSTANTES.ALERT_TIPO_MSG.DANGER, CONSTANTES.MSG_ERROR_INESPERADO));
        dispatch(procesoError(true));
      });


  }
}

export const generarCaptura = (loteId, fechaCaptura, fnSuccess) => {
  return dispatch => {
    dispatch(procesoIniciado());
    const url = '/secado/generarCaptura/?loteId=' + loteId + '&fechaCaptura=' + fechaCaptura;
    const header = { Authorization: localStorage.getItem('token') };
    const data = {
      'loteId': loteId,
      'fechaCaptura': fechaCaptura
    };

    axios.post(url, data, { headers: header })
      .then((response) => {
        if (fnSuccess) {
          fnSuccess();
        }
      }).catch(error => {
        if (error.response === undefined) {
          dispatch(mostrarOcultarMensaje(true, 3, CONSTANTES.MSG_ERROR_INESPERADO));

        } else {
          if (error.response.status === 409) {
            // poner aqui el mensaje del cnflicto
            dispatch(mostrarOcultarMensaje(true, CONSTANTES.ALERT_TIPO_MSG.WARNING, 'La pesada ya se encuentra capturada, verifique'));
          } else {
            dispatch(mostrarOcultarMensaje(true, CONSTANTES.ALERT_TIPO_MSG.DANGER, CONSTANTES.MSG_ERROR_INESPERADO));
          }
        }
        console.error('generarCaptura', error);
        dispatch(procesoError(true));

      });
  }
}

export const fetchAnimales = (loteId, fechaCaptura, fnSuccess) => {
  return dispatch => {
    dispatch(procesoIniciado());
    const url = '/secado/?l=' + loteId + '&f=' + fechaCaptura;

    axios.get(url, { headers: { Authorization: localStorage.getItem('token') } })
      .then((response) => {

        const motivosSecado = response.data.motivosSecado;
        const gruposProductivos = response.data.gruposProductivos;
        const loteDestinoDefault = response.data.loteDestinoDefault;

        dispatch(setCatalogos(motivosSecado, gruposProductivos, loteDestinoDefault));

        dispatch(setAnimales(response.data.listaRegistros));

        dispatch(setLoteCaptura(response.data.loteCaptura));

        dispatch(setFechaCaptura(fechaCaptura));

        dispatch(procesoFinalizado());

        if (fnSuccess !== undefined) {
          let params = {
            step: CONSTANTES.SECADO_STEPS.CAPTURA_INF_COLECTADA,
            lote: response.data.loteCaptura,
            listaRegistros: response.data.listaRegistros,
          }
          fnSuccess(params);
        }

      }).catch(error => {
        console.error('fetchAnimales', error);
        if (error.response === undefined) {

          dispatch(mostrarOcultarMensaje(true, 3, CONSTANTES.MSG_ERROR_INESPERADO));

        } else {
          if (error.response.status === 409) {
            dispatch(setPesadaNoEncontrada(true));
          } else {
            dispatch(mostrarOcultarMensaje(true, CONSTANTES.ALERT_TIPO_MSG.DANGER, CONSTANTES.MSG_ERROR_INESPERADO));
          }
        }
        dispatch(procesoFinalizado());
        dispatch(procesoError(true));
      });
  }
}

export const actualizarSecado = (animalId, loteId, motivoId, grupoProductivoId, loteDestinoId, fnSuccess) => {

  const url = '/secado/' + animalId;
  const header = { Authorization: localStorage.getItem('token') };
  const data = {
    'secado': {
      'loteId': loteId,
    },
    'motivoSecado': {
      'id': motivoId,
      'subgrupoDestinoId': grupoProductivoId,
      'loteDestinoId': loteDestinoId,
    }
  };

  return dispatch => {

    // dispatch(procesoIniciado());

    axios.put(url, data, { headers: header })
      .then((response) => {

        if (fnSuccess !== undefined)
          fnSuccess(false);

        dispatch(procesoFinalizado());
      }).catch(error => {
        console.error('actualizarSecado', error);
        dispatch(mostrarOcultarMensaje(true, 3, CONSTANTES.MSG_ERROR_INESPERADO));
        if (fnSuccess !== undefined)
          fnSuccess(false);
        dispatch(procesoFinalizado());
        dispatch(procesoError(true));
      });


  }
}


export const fetchAnimalesFinalizar = (loteId, fechaCaptura, fnSuccess) => {
  return dispatch => {
    dispatch(procesoIniciado());
    const url = '/secado/getListaFinalizado?l=' + loteId + '&f=' + fechaCaptura;

    axios.get(url, { headers: { Authorization: localStorage.getItem('token') } })
      .then((response) => {

        dispatch(setAnimales(response.data.listaRegistros));

        dispatch(setLoteCaptura(response.data.loteCaptura));

        dispatch(setFechaCaptura(fechaCaptura));

        dispatch(procesoFinalizado());

        if (fnSuccess !== undefined) {

          let params = {
            step: CONSTANTES.SECADO_STEPS.CAPTURA_INF_COLECTADA,
            lote: response.data.loteCaptura,
            listaRegistros: response.data.listaRegistros,
          }
          fnSuccess(params);
        }

      }).catch(error => {
        console.error('fetchAnimales', error);
        if (error.response === undefined) {

          dispatch(mostrarOcultarMensaje(true, 3, CONSTANTES.MSG_ERROR_INESPERADO));

        } else {
          if (error.response.status === 409) {
            dispatch(setPesadaNoEncontrada(true));
          } else {
            dispatch(mostrarOcultarMensaje(true, CONSTANTES.ALERT_TIPO_MSG.DANGER, CONSTANTES.MSG_ERROR_INESPERADO));
          }
        }
        dispatch(procesoFinalizado());
        dispatch(procesoError(true));
      });
  }
}

export const eliminarCaptura = (loteId, fnSuccess) => {

  const url = '/secado/' + loteId;
  const header = { Authorization: localStorage.getItem('token') };

  return dispatch => {
    dispatch(procesoIniciado());

    axios.delete(url, { headers: header })
      .then((response) => {

        // dispatch(procesoFinalizado());

        if (fnSuccess !== undefined) {
          fnSuccess();
        }

      }).catch(error => {
        dispatch(mostrarOcultarMensaje(true, CONSTANTES.ALERT_TIPO_MSG.DANGER, CONSTANTES.MSG_ERROR_INESPERADO));
        console.error('eliminarCaptura', error);
        dispatch(procesoError(true));
      });

  }
}

export const finalizarCaptura = (loteId, fnSuccess) => {

  const url = '/secado/finalizar/' + loteId;

  return dispatch => {
    dispatch(procesoIniciado());

    axios.get(url, { headers: { Authorization: localStorage.getItem('token') } })
      .then((response) => {

        if (fnSuccess !== undefined) {
          fnSuccess();
        }

      }).catch(error => {
        dispatch(mostrarOcultarMensaje(true, CONSTANTES.ALERT_TIPO_MSG.DANGER, CONSTANTES.MSG_ERROR_INESPERADO));
        console.error('finalizarCaptura', error);
        dispatch(procesoError(true));
      });








  }
}