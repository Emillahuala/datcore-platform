export interface OpcionRespuesta {
  id_cat_respuesta: number
  letra: string
  texto: string
  valor: number
}

export interface PreguntaReal {
  id_cat_pregunta: number
  codigo_pregunta: string
  enunciado: string
  bloque: string
  orden: number
  opciones: OpcionRespuesta[]
}

export interface CuestionarioData {
  id_area: number
  nombre_area: string
  id_mae_proyecto: string
  id_mae_empresa: string
  preguntas: PreguntaReal[]
  estado: 'pendiente' | 'en_progreso' | 'completado'
  progreso: number
  respuestas_guardadas: Record<number, number> // id_cat_pregunta → id_cat_respuesta
}

export interface AreaEncargado {
  id_area: number
  nombre_area: string
  id_mae_proyecto: string
  nombre_proyecto: string
  id_mae_empresa: string
  estado: 'pendiente' | 'en_progreso' | 'completado'
  progreso: number
  total_preguntas: number
  respondidas: number
}
