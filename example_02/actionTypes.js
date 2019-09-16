
// ------------ Authentication Module
export const AUTH_START = 'AUTH_START';
export const AUTH_SUCCESS = 'AUTH_SUCCESS';
export const AUTH_FAIL = 'AUTH_FAIL';
export const AUTH_LOGOUT = 'AUTH_LOGOUT';
export const SET_AUTH_REDIRECT_PATH = 'SET_AUTH_REDIRECT_PATH';
export const AUTH_SET_DATOS_USUARIO = 'AUTH_SET_DATOS_USUARIO';
export const AUTH_ADMINISTRAR_MENSAJE = 'AUTH_ADMINISTRAR_MENSAJE';

// ------------ UPLOADS Module
export const UPLOAD_SET_PROCESO_INICIADO = 'UPLOAD_SET_PROCESO_INICIADO';
export const UPLOAD_SET_PROCESO_FINALIZADO = 'UPLOAD_SET_PROCESO_FINALIZADO';
export const UPLOAD_SET_PROCESO_ERROR = 'UPLOAD_SET_PROCESO_ERROR';
export const UPLOAD_ADMINISTRAR_MENSAJE = 'UPLOAD_ADMINISTRAR_MENSAJE';

// ------------ Users Module
export const USR_SET_PROCESO_INICIADO = 'USR_SET_PROCESO_INICIADO';
export const USR_SET_PROCESO_FINALIZADO = 'USR_SET_PROCESO_FINALIZADO';
export const USR_SET_PROCESO_ERROR = 'USR_SET_PROCESO_ERROR';
export const USR_ADMINISTRAR_MENSAJE = 'USR_ADMINISTRAR_MENSAJE';
export const USR_SET_USUARIOS = 'USR_SET_USUARIOS';
export const USR_UPD_USUARIO = 'USR_UPD_USUARIO';
export const USR_DEL_USUARIO = 'USR_DEL_USUARIO';
export const USR_SET_USUARIO = 'USR_SET_USUARIO';
export const USR_CREATE_USUARIO = 'USR_CREATE_USUARIO';

// ------------ Date Module
export const DATE_SET_PROCESO_INICIADO = 'DATE_SET_PROCESO_INICIADO';
export const DATE_SET_PROCESO_FINALIZADO = 'DATE_SET_PROCESO_FINALIZADO';
export const DATE_SET_PROCESO_ERROR = 'DATE_SET_PROCESO_ERROR';
export const DATE_SET_FECHA = 'DATE_SET_FECHA';
export const DATE_SET_SEMANA = 'DATE_SET_SEMANA';
export const DATE_LIMPIAR_FECHA = 'DATE_LIMPIAR_FECHA';

// ------------ UbicacionListComponent
export const ULC_SET_STATUS_INICIAL = 'ULC_SET_STATUS_INICIAL';
export const ULC_SET_UBICACIONES = 'ULC_SET_UBICACIONES';
export const ULC_SET_PROCESO_INICIADO = 'ULC_SET_PROCESO_INICIADO';
export const ULC_SET_PROCESO_FINALIZADO = 'ULC_SET_PROCESO_FINALIZADO';
export const ULC_SET_PROCESO_ERROR = 'ULC_SET_PROCESO_ERROR';
export const ULC_SET_RANCHO = 'ULC_SET_RANCHO';
export const ULC_SET_POTRERO = 'ULC_SET_POTRERO';
export const ULC_SET_LOTE = 'ULC_SET_LOTE';
export const ULC_CANCELAR_EDICION = 'ULC_CANCELAR_EDICION';
export const UCL_ACTUALIZAR_NUMERO_PASO = 'UCL_ACTUALIZAR_NUMERO_PASO';

// ------------ Location Module
export const LOCATION_SET_PROCESO_INICIADO = 'LOCATION_SET_PROCESO_INICIADO';
export const LOCATION_SET_PROCESO_FINALIZADO = 'LOCATION_SET_PROCESO_FINALIZADO';
export const LOCATION_SET_PROCESO_ERROR = 'LOCATION_SET_PROCESO_ERROR';
export const LOCATION_SET_STATUS_INICIAL = 'LOCATION_SET_STATUS_INICIAL';
export const LOCATION_POPULATE_RANCHOS = 'LOCATION_POPULATE_RANCHOS';
export const LOCATION_SET_RANCHO = 'LOCATION_SET_RANCHO';
export const LOCATION_SET_POTRERO = 'LOCATION_SET_POTRERO';
export const LOCATION_SET_LOTE = 'LOCATION_SET_LOTE';
export const LOCATION_ENABLE_CABECERA = 'LOCATION_ENABLE_CABECERA';
export const LOCATION_LIMPIAR_CABECERA = 'LOCATION_LIMPIAR_CABECERA';

// ------------ Reporte Ordeña Module
export const RPT_ORD_SET_PROCESO_INICIADO = 'RPT_ORD_SET_PROCESO_INICIADO';
export const RPT_ORD_PROCESO_FINALIZADO = 'RPT_ORD_PROCESO_FINALIZADO';
export const RPT_ORD_PROCESO_ERROR = 'RPT_ORD_PROCESO_ERROR';
export const RPT_ORD_ADMINISTRAR_MENSAJE = 'RPT_ORD_ADMINISTRAR_MENSAJE';
export const RPT_ORD_SET_DATOS = 'RPT_ORD_SET_DATOS';
export const RPT_ORD_SET_DATOS_REPORTE_CAPTURA = 'RPT_ORD_SET_DATOS_REPORTE_CAPTURA';
export const RPT_ORD_SET_REPORTE_CONSTRUIDO = 'RPT_ORD_SET_REPORTE_CONSTRUIDO';
export const RPT_ORD_LIMPIAR = 'RPT_ORD_LIMPIAR';
export const RPT_ORD_REGRESAR = 'RPT_ORD_REGRESAR';
export const RPT_ORD_CONSTRUYENDO = 'RPT_ORD_CONSTRUYENDO';

// ------------ Ordeña Module
export const ORD_SET_PROCESO_INICIADO = 'ORD_SET_PROCESO_INICIADO';
export const ORD_SET_PROCESO_FINALIZADO = 'ORD_SET_PROCESO_FINALIZADO';
export const ORD_SET_PROCESO_ERROR = 'ORD_SET_PROCESO_ERROR';
export const ORD_ADMINISTRAR_MENSAJE = 'USR_ADMINISTRAR_MENSAJE';
export const ORD_FECHA_MUY_DISTANTE = 'ORD_FECHA_MUY_DISTANTE';
export const ORD_LIMPIAR_TODO = 'ORD_LIMPIAR_TODO';
export const ORD_UPD_ANIMALES_LISTADOS = 'ORD_UPD_ANIMALES_LISTADOS';
export const ORD_UPD_LOADING = 'ORD_UPD_LOADING';
export const ORD_SET_DATA = 'ORD_SET_DATA';
export const ORD_SALVAR_AVANCE = 'ORD_SALVAR_AVANCE';
export const ORD_UPD_STATE_VACAS = 'ORD_UPD_STATE_VACAS';
export const ORD_SET_INFORMACION_CAPTURA = 'ORD_SET_INFORMACION_CAPTURA';
export const ORD_END_CAPTURA = 'ORD_END_CAPTURA';
export const ORD_PESADA_NO_ENCONTRADA = 'ORD_PESADA_NO_ENCONTRADA';
export const ORD_SET_DATOS_CAPTURA_PENDIENTE = 'ORD_SET_DATOS_CAPTURA_PENDIENTE';


export const ORD_GET_ANIMALES = 'ORD_GET_ANIMALES';// ELIMINAR

export const ORD_UPD_CAPTURA = 'ORD_UPD_CAPTURA';
export const ORD_MOSTRAR_DIV_CAPTURA = 'ORD_MOSTRAR_DIV_CAPTURA';
export const ORD_UPD_FECHA = 'ORD_UPD_FECHA';
export const ORD_GET_FECHA = 'ORD_GET_FECHA';
export const ORD_SET_MSG_ORD_INV = 'ORD_SET_MSG_ORD_INV';
export const ORD_LIMPIAR_MENSAJE_LISTAR_NO_VALIDO = 'ORD_LIMPIAR_MENSAJE_LISTAR_NO_VALIDO';
export const ORD_LIMPIAR_MSG_FECHA_MUY_DISTANTE = 'ORD_LIMPIAR_MSG_FECHA_MUY_DISTANTE';
export const ORD_DEL_CAPTURA_TEMPORAL = 'ORD_DEL_CAPTURA_TEMPORAL';
export const ORD_UPD_MOSTRAR_MSG_CAPTURA_VALIDA = 'ORD_UPD_MOSTRAR_MSG_CAPTURA_VALIDA';
export const ORD_UPD_CAPTURA_RAPIDA = 'ORD_UPD_CAPTURA_RAPIDA';
export const ORD_UPD_MOSTRAR_MSG_SECADO_PENDIENTE = 'ORD_UPD_MOSTRAR_MSG_SECADO_PENDIENTE';
export const ORD_UPD_VAR_BUSQUEDA = 'ORD_UPD_VAR_BUSQUEDA';
export const ORD_EDIT_LIST = 'ORD_EDIT_LIST';
export const ORD_ON_EDIT_LIST = 'ORD_ON_EDIT_LIST';
export const ORD_GUARDAR_CAPTURA = 'ORD_GUARDAR_CAPTURA';
export const ORD_DISABLE_CAPTURA = 'ORD_DISABLE_CAPTURA';
export const ORD_MOSTRAR_ALERTAS_CAPTURA = 'ORD_MOSTRAR_ALERTAS_CAPTURA';


export const ORD_MARCAR_ANIMAL_SECADO = 'ORD_MARCAR_VACA_SECADO';
export const ORD_SET_FILTRO_SELECCIONADO = 'ORD_SET_FILTRO_SELECCIONADO';
export const ORD_SET_ANIMAL_SELECCIONADO = 'ORD_SET_ANIMAL_SELECCIONADO';
export const ORD_SET_EDITANDO_ANIMALES = 'ORD_SET_EDITANDO_ANIMALES';
export const ORD_SALVAR_PROGRESO = 'ORD_SALVAR_PROGRESO';
export const ORD_UPDATE_ANIMALES_CAPTURADOS = 'ORD_UPDATE_ANIMALES_CAPTURADOS';

export const ORD_REMOVER_ANIMAL = 'ORD_REMOVER_ANIMAL';
export const ORD_UPD_ANIMALES_SECADO = 'ORD_UPD_ANIMALES_SECADO';

// ------------ Secado Module
export const SEC_SET_PROCESO_INICIADO = 'ORD_SET_PROCESO_INICIADO';
export const SEC_SET_PROCESO_FINALIZADO = 'ORD_SET_PROCESO_FINALIZADO';
export const SEC_SET_PROCESO_ERROR = 'SEC_SET_PROCESO_ERROR';
export const SEC_ADMINISTRAR_MENSAJE = 'SEC_ADMINISTRAR_MENSAJE';
export const SEC_SET_LOTE_CAPTURA = 'SEC_SET_LOTE_CAPTURA';
export const SEC_SET_FECHA_CAPTURA = 'SEC_SET_FECHA_CAPTURA';
export const SEC_SET_SEMANA_CAPTURA = 'SEC_SET_SEMANA_CAPTURA';
export const SEC_SET_CATALOGOS = 'SEC_SET_CATALOGOS';
export const SEC_SET_PESADA_NO_ENCONTRADA = 'SEC_SET_PESADA_NO_ENCONTRADA';
export const SEC_SET_FECHA_ENCONTRADA = 'SEC_SET_FECHA_ENCONTRADA';
export const SEC_SET_ANIMALES = 'SEC_SET_ANIMALES';



// ------------ Servicios Module
export const SER_SET_PROCESO_INICIADO = 'SER_SET_PROCESO_INICIADO';
export const SER_SET_PROCESO_FINALIZADO = 'SER_SET_PROCESO_FINALIZADO';
export const SER_SET_PROCESO_ERROR = 'SER_SET_PROCESO_ERROR';
export const SER_ADMINISTRAR_MENSAJE = 'SER_ADMINISTRAR_MENSAJE';
export const SER_UPD_HEADER = 'SER_UPD_HEADER';
export const SER_SET_CLAVE_ANIMAL = 'SER_SET_CLAVE_ANIMAL';
export const SER_SET_ANIMAL_SIN_TARJETA = 'SER_SET_ANIMAL_SIN_TARJETA';
export const SER_LIMPIAR_TODO = 'SER_LIMPIAR_TODO';
export const SER_SET_ANIMAL_GESTANTE = 'SER_SET_ANIMAL_GESTANTE';
export const SER_SET_SERVICIOS = 'SER_SET_SERVICIOS';
export const SER_SET_SERVICIOS_PERIODO_SELECCIONADO = 'SER_SET_SERVICIOS_PERIODO_SELECCIONADO';
export const SER_SET_ANIMAL_ID = 'SER_SET_ANIMAL_ID';
export const SER_SET_ANIMAL_ENCONTRADO = 'SER_SET_ANIMAL_ENCONTRADO';
export const SER_SET_STATUS_ANIMAL = 'SER_SET_STATUS_ANIMAL';
export const SER_SET_DATOS_PROCESO = 'SER_SET_DATOS_PROCESO';
export const SER_SET_DATOS_PALPADO_ULTIMO = 'SER_SET_DATOS_PALPADO_ULTIMO';
export const SER_SET_DATOS_PARTO_ULTIMO = 'SER_SET_DATOS_PARTO_ULTIMO';
export const SER_SET_PANTALLA_SELECCIONADA = 'SER_SET_PANTALLA_SELECCIONADA';
export const SER_SET_FECHA_SERVICIO = 'SER_SET_FECHA_SERVICIO';
export const SER_SET_TIPO_SERVICIO = 'SER_SET_TIPO_SERVICIO';
export const SER_SET_MOSTRAR_ERRORES = 'SER_SET_MOSTRAR_ERRORES';
export const SER_SET_SGP_ANIMAL = 'SER_SET_SGP_ANIMAL';
export const SER_SET_IS_VALIDATING_TORO = 'SER_SET_IS_VALIDATING_TORO';
export const SER_SET_CLAVE_TORO = 'SER_SET_CLAVE_TORO';
export const SER_SET_CONFIRM_NO_ENCONTRADO = 'SER_SET_CONFIRM_NO_ENCONTRADO';
export const SER_APROBAR_TORO = 'SER_APROBAR_TORO';


export const BUSQTORO_SET_PROCESO_INICIADO = 'BUSQTORO_SET_PROCESO_INICIADO';
export const BUSQTORO_SET_PROCESO_FINALIZADO = 'BUSQTORO_SET_PROCESO_FINALIZADO';
export const BUSQTORO_SET_PROCESO_ERROR = 'BUSQTORO_SET_PROCESO_ERROR';
export const BUSQTORO_ADMINISTRAR_MENSAJE = 'BUSQTORO_ADMINISTRAR_MENSAJE';
export const BUSQTORO_MOSTRAR_MODAL_BUSQUEDA = 'BUSQTORO_MOSTRAR_MODAL_BUSQUEDA';
export const BUSQTORO_SET_TEXTO_BUSQUEDA = 'BUSQTORO_SET_TEXTO_BUSQUEDA';
export const BUSQTORO_SET_TIPO_BUSQUEDA = 'BUSQTORO_SET_TIPO_BUSQUEDA';
export const BUSQTORO_SET_ANIMALES = 'BUSQTORO_SET_ANIMALES';
export const BUSQTORO_SET_TORO = 'BUSQTORO_SET_TORO';
export const BUSQTORO_INICIALIZAR_BUSQUEDA = 'BUSQTORO_INICIALIZAR_BUSQUEDA';
export const BUSQTORO_SET_SOLO_ACTIVOS = 'BUSQTORO_SET_SOLO_ACTIVOS';
export const BUSQTORO_SET_DATOS_PAGINACION = 'BUSQTORO_SET_DATOS_PAGINACION';