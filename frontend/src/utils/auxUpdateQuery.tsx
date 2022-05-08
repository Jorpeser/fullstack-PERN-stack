import { Cache, QueryInput } from "@urql/exchange-graphcache";

// Revisar y estudiar bien que hace esta función 3:30:00 benawad
export function auxUpdateQuery<Result, Query>(
    cache: Cache,
    qi: QueryInput,
    result: any,
    fn: (r: Result, q: Query) => Query) {
    return cache.updateQuery(qi, data => fn(result, data as any) as any);
}
