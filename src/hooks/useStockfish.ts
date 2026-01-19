import { useState, useEffect, useRef } from 'react';

export interface EngineResult {
    evaluation: number;
    bestMove: string;
    bestLine: string[];
    depth: number;
}

export const useStockfish = (fen: string, enabled: boolean) => {
    const [result, setResult] = useState<EngineResult | null>(null);
    const [isReady, setIsReady] = useState(false);
    const workerRef = useRef<Worker | null>(null);

    // Initialize worker
    useEffect(() => {
        if (!enabled) {
            setResult(null);
            setIsReady(false);
            return;
        }

        // Initialize worker using a CDN version of Stockfish
        // We use version 10 as it's pure JS and widely compatible
        const blob = new Blob([`
            importScripts('https://cdnjs.cloudflare.com/ajax/libs/stockfish.js/10.0.2/stockfish.js');
            const engine = typeof Stockfish === 'function' ? Stockfish() : null;
            if (engine) {
                engine.onmessage = function(event) {
                    postMessage(event);
                };
                onmessage = function(event) {
                    engine.postMessage(event.data);
                };
            }
        `], { type: 'application/javascript' });

        const workerUrl = URL.createObjectURL(blob);
        const worker = new Worker(workerUrl);
        workerRef.current = worker;

        worker.onmessage = (event) => {
            const line = event.data;
            if (typeof line !== 'string') return;

            // Initialization sequence
            if (line === 'uciok') {
                worker.postMessage('setoption name MultiPV value 1');
                worker.postMessage('isready');
            } else if (line === 'readyok') {
                setIsReady(true);
            }

            // Analysis parsing
            if (line.startsWith('info depth')) {
                const depthMatch = line.match(/depth (\d+)/);
                const cpMatch = line.match(/cp (-?\d+)/);
                const mateMatch = line.match(/mate (-?\d+)/);
                const pvMatch = line.match(/pv (.+)/);

                if (depthMatch && (cpMatch || mateMatch)) {
                    const depth = parseInt(depthMatch[1]);
                    let evaluation = 0;

                    if (cpMatch) {
                        evaluation = parseInt(cpMatch[1]) / 100;
                    } else if (mateMatch) {
                        const mateIn = parseInt(mateMatch[1]);
                        // If mate is positive (mate in X moves for us), give huge score
                        // If mate is negative (mate in X moves for opponent), give huge negative score
                        evaluation = mateIn > 0 ? 10000 - mateIn : -10000 - mateIn;
                    }

                    const bestLine = pvMatch ? pvMatch[1].split(' ') : [];
                    const bestMove = bestLine[0] || '';

                    setResult({
                        depth,
                        evaluation,
                        bestMove,
                        bestLine
                    });
                }
            }
        };

        // Start initialization sequence
        worker.postMessage('uci');

        return () => {
            worker.terminate();
            URL.revokeObjectURL(workerUrl);
            workerRef.current = null;
            setIsReady(false);
        };
    }, [enabled]);

    // Handle analysis commands
    useEffect(() => {
        if (!workerRef.current || !isReady || !enabled) return;

        // Stop any previous search
        workerRef.current.postMessage('stop');

        // Start new search
        workerRef.current.postMessage(`position fen ${fen}`);
        workerRef.current.postMessage('go depth 15');

    }, [fen, isReady, enabled]);

    return result;
};
