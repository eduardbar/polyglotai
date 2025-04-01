import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { cn, formatConfidenceScore, getConfidenceColor } from '@/lib/utils';
import { ConfidenceGaugeProps } from '@/types';

/**
 * Componente de medidor de confianza usando D3.js
 */
export function ConfidenceGauge({ 
  score, 
  size = 120, 
  className 
}: ConfidenceGaugeProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || score === null) return;

    // Limpiar SVG anterior
    d3.select(svgRef.current).selectAll('*').remove();

    const svg = d3.select(svgRef.current);
    const width = size;
    const height = size;
    const radius = Math.min(width, height) / 2 - 10;

    // Configurar el SVG
    svg
      .attr('width', width)
      .attr('height', height);

    const g = svg
      .append('g')
      .attr('transform', `translate(${width / 2}, ${height / 2})`);

    // Crear el arco de fondo
    const backgroundArc = d3.arc()
      .innerRadius(radius * 0.6)
      .outerRadius(radius)
      .startAngle(0)
      .endAngle(2 * Math.PI);

    // Crear el arco de progreso
    const progressArc = d3.arc()
      .innerRadius(radius * 0.6)
      .outerRadius(radius)
      .startAngle(-Math.PI / 2)
      .endAngle(-Math.PI / 2 + (2 * Math.PI * score));

    // Dibujar el arco de fondo con degradado radial
    const defs = svg.append('defs');
    const grad = defs.append('radialGradient')
      .attr('id', 'gauge-bg')
      .attr('cx', '50%')
      .attr('cy', '50%');
    grad.append('stop').attr('offset', '0%').attr('stop-color', 'rgba(255,255,255,0.35)');
    grad.append('stop').attr('offset', '100%').attr('stop-color', 'rgba(255,255,255,0.12)');

    g.append('path')
      .datum({})
      .attr('d', backgroundArc as any)
      .attr('fill', 'url(#gauge-bg)')
      .attr('opacity', 0.35);

    // Dibujar el arco de progreso
    const prog = g.append('path')
      .datum({})
      .attr('d', progressArc as any)
      .attr('fill', '#e5e7eb')
      .attr('opacity', 0.9);
    prog
      .transition()
      .duration(900)
      .ease(d3.easeCubicOut)
      .attrTween('d', () => {
        const interp = d3.interpolate(-Math.PI / 2, -Math.PI / 2 + (2 * Math.PI * score));
        return (t: number) => (d3.arc() as any)()
      });

    // Agregar el texto del porcentaje
    g.append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', '0.35em')
      .attr('class', 'text-2xl font-semibold')
      .attr('fill', 'white')
      .text(formatConfidenceScore(score));

    // Agregar texto de etiqueta
    g.append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', '2.5em')
      .attr('class', 'text-sm')
      .attr('fill', '#9ca3af')
      .text('Confianza');

  }, [score, size]);

  if (score === null) {
    return (
      <div className={cn('flex items-center justify-center', className)}>
        <div className="text-text-secondary text-sm">
          Sin datos de confianza
        </div>
      </div>
    );
  }

  return (
    <div className={cn('flex flex-col items-center', className)}>
      <svg ref={svgRef} className="mb-2 drop-shadow-[0_6px_20px_rgba(255,255,255,0.18)]" />
      <div className="text-center">
        <p className="text-sm text-text-secondary">
          Puntuación de confianza del modelo
        </p>
      </div>
    </div>
  );
}
