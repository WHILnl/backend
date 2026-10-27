import type { Provider } from "@/types.d.ts";

type ProviderClass = (new (...args: any[]) => Provider) & {
    Name: string
}

const providers = new Map<string, ProviderClass>();

export default {
    register(provider: ProviderClass) {
        providers.set(provider.Name, provider)
    },
    safeGet(name: string): ProviderClass | undefined {
        return providers.get(name)
    },
    get(name: string): ProviderClass {
        let provider = this.safeGet(name)
        if (provider == undefined) {
            throw new Error(`provider '${name}' not registered.`)
        }
        return provider
    },
    new(name: string, ...args: any[]) {
        let provider = this.get(name)
        return new provider(...args)
    }
}