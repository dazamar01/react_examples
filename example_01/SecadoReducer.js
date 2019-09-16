import * as at from '../actions/actionTypes';
import { updateObject } from '../../shared/utility';

const initialState = {
  loading: false,
  error: null,
  mostrarMensaje: false,
  tipoMensaje: 1,
  mensaje: '',

  // propias
  fechaCaptura: '',
  semanaCaptura: '',
  loteCaptura: '',
  animales: null,


  pesadaNoEncontrada: false,
  fechaEncontrada: '',



  // catalogos
  motivosSecado: null,
  gruposProductivos: null,
  loteDestinoDefault: null,
    
  motivoSecadoSeleccionado: null,
  grupoProductivoSeleccionado: null,
  ubicacionDestinoSeleccionada: null,

}
// ---------------------------------------------------------------- BASICS
const procesoIniciado = (state, action) => {
  return updateObject(state, { error: null, loading: true, procesoConcluido: false });
};

const procesoFinalizado = (state, action) => {
  return updateObject(state, { error: null, loading: false, procesoConcluido: false });
};

const procesoError = (state, action) => {
  return updateObject(state, { error: action.error, loading: false, procesoConcluido: false });
};

const mostrarOcultarMensaje = (state, action) => {
  return updateObject(state, {
    mostrarMensaje: action.mostrarMensaje,
    tipoMensaje: action.tipoMensaje,
    mensaje: action.mensaje
  });
}
// ----------------------------------------------------------------

const setLoteCaptura = (state, action) => {
  return updateObject(state, { loteCaptura: action.loteCaptura });
};

const setFechaCaptura = (state, action) => {
  return updateObject(state, { fechaCaptura: action.fechaCaptura });
};

const setSemanaCaptura = (state, action) => {
  return updateObject(state, { semanaCaptura: action.semanaCaptura });
};

const setCatalogos = (state, action) => {
  return updateObject(state, {
    motivosSecado: action.motivosSecado,
    gruposProductivos: action.gruposProductivos,
    loteDestinoDefault: action.loteDestinoDefault
  });
}

const setPesadaNoEncontrada = (state, action) => {
  return updateObject(state, {
    pesadaNoEncontrada: action.value
  });
}

const setFechaEncontrada = (state, action) => {
  return updateObject(state, {
    fechaEncontrada: action.fechaEncontrada
  });
}

const setAnimales = (state, action) => {
  return updateObject(state, {
    animales: action.animales
  });
}

const reducer = (state = initialState, action) => {
  switch (action.type) {

    case at.SEC_SET_PROCESO_INICIADO: return procesoIniciado(state, action);
    case at.SEC_SET_PROCESO_FINALIZADO: return procesoFinalizado(state, action);
    case at.SEC_SET_PROCESO_ERROR: return procesoError(state, action);
    case at.SEC_ADMINISTRAR_MENSAJE: return mostrarOcultarMensaje(state, action);

    case at.SEC_SET_LOTE_CAPTURA: return setLoteCaptura(state, action);
    case at.SEC_SET_FECHA_CAPTURA: return setFechaCaptura(state, action);
    case at.SEC_SET_SEMANA_CAPTURA: return setSemanaCaptura(state, action);

    case at.SEC_SET_CATALOGOS: return setCatalogos(state, action);
    case at.SEC_SET_PESADA_NO_ENCONTRADA: return setPesadaNoEncontrada(state, action);
    case at.SEC_SET_FECHA_ENCONTRADA: return setFechaEncontrada(state, action);
    case at.SEC_SET_ANIMALES: return setAnimales(state, action);




    default:
      return state;
  }
};
export default reducer;