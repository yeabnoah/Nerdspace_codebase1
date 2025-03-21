"use client"

import { QueryClient, QueryClientProvider  } from "@tanstack/react-query"
import {ReactQueryDevtools} from "@tanstack/react-query-devtools"
import { ReactNode } from 'react'
export const queryClient = new QueryClient()

const TanstackQueryProvider = ({children} : {children : ReactNode}) => {
    
  return (
    <QueryClientProvider client={queryClient}>
        {children}
        {/* <ReactQueryDevtools initialIsOpen={false} /> */}
    </QueryClientProvider>
  )
}

export default TanstackQueryProvider
