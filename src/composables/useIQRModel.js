export async function useIqrModel(configPath) {
    const modules = import.meta.glob('@/models/*.json');

    const normalizedPath = configPath.startsWith('/') ? configPath : `/${configPath}`;

    if (!modules[normalizedPath]) {
        console.error(`Available models:`, Object.keys(modules));
        throw new Error(`Config not found: ${normalizedPath}`);
    }

    const config = await modules[normalizedPath]();

    const applyScaling = (val, center, scale) => (val - center) / scale;

    const getTargetValue = () => config.model.target_col;

    const predict = (value) => {
        const scaledValue = applyScaling(value, config.scaler.center, config.scaler.scale);
        console.log(`Scaled value${scaledValue}, original value: ${value}, mean: ${config.scaler.center}, scaled: ${config.scaler.scale}`);
        return (scaledValue < config.model.lower_bound || scaledValue > config.model.upper_bound) ? -1 : 1;
    };

    return { predict, getTargetValue };
}