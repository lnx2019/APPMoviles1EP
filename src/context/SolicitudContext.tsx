import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { Solicitud } from '../models/solicitud';

type Action =
  | { type: 'AGREGAR'; payload: Solicitud }
  | { type: 'ACTUALIZAR'; payload: Solicitud }
  | { type: 'ELIMINAR'; payload: string }
  | { type: 'CARGAR'; payload: Solicitud[] };

interface State {
  solicitudes: Solicitud[];
}

const initialState: State = {
  solicitudes: [],
};

function solicitudReducer(state: State, action: Action): State {
  switch (action.type) {
    case 'AGREGAR':
      return { ...state, solicitudes: [...state.solicitudes, action.payload] };
    case 'ACTUALIZAR':
      return {
        ...state,
        solicitudes: state.solicitudes.map((s) =>
          s.id === action.payload.id ? action.payload : s,
        ),
      };
    case 'ELIMINAR':
      return {
        ...state,
        solicitudes: state.solicitudes.filter((s) => s.id !== action.payload),
      };
    case 'CARGAR':
      return { ...state, solicitudes: action.payload };
    default:
      return state;
  }
}

interface SolicitudContextType {
  state: State;
  dispatch: React.Dispatch<Action>;
}

const SolicitudContext = createContext<SolicitudContextType | undefined>(undefined);

export function SolicitudProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(solicitudReducer, initialState);

  return (
    <SolicitudContext.Provider value={{ state, dispatch }}>
      {children}
    </SolicitudContext.Provider>
  );
}

export function useSolicitudes() {
  const context = useContext(SolicitudContext);
  if (!context) {
    throw new Error('useSolicitudes debe usarse dentro de SolicitudProvider');
  }
  return context;
}
