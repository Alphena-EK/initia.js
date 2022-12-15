import { BaseAPI } from './BaseAPI';
import { AccAddress } from '../../../core/bech32';
import { APIParams, Pagination, PaginationOptions } from '../APIRequester';

export interface Module {
  address: AccAddress;
  module_name: string;
  code_bytes: string;
  abi: string;
}

export interface ExecuteResult {
  data: string;
}

export interface Resource {
  address: AccAddress;
  struct_tag: string;
  resource_bytes: string;
  move_resource: string;
}

export interface ABI {
  abi: string;
}

export class MoveAPI extends BaseAPI {
  public async modules(
    address: AccAddress,
    params: Partial<PaginationOptions & APIParams> = {}
  ): Promise<[Module[], Pagination]> {
    return this.c
      .get<{
        modules: Module[];
        pagination: Pagination;
      }>(`/initia/move/v1/accounts/${address}/modules`, params)
      .then(d => [
        d.modules.map(mod => ({
          address: mod.address,
          module_name: mod.module_name,
          code_bytes: mod.code_bytes,
          abi: mod.abi,
        })),
        d.pagination,
      ]);
  }

  public async module(
    address: AccAddress,
    moduleName: string,
    params: APIParams = {}
  ): Promise<Module> {
    return this.c
      .get<{ module: Module }>(
        `/initia/move/v1/accounts/${address}/modules/${moduleName}`,
        params
      )
      .then(({ module: d }) => ({
        address: d.address,
        module_name: d.module_name,
        code_bytes: d.code_bytes,
        abi: d.abi,
      }));
  }

  public async executeEntryFunction(
    address: AccAddress,
    moduleName: string,
    functionName: string,
    typeArgs: string[],
    args: string[]
  ): Promise<ExecuteResult> {
    return this.c.post<ExecuteResult>(
      `/initia/move/v1/accounts/${address}/modules/${moduleName}/entry_functions/${functionName}`,
      {
        type_args: typeArgs,
        args,
      }
    );
  }

  public async resources(
    address: AccAddress,
    params: Partial<PaginationOptions & APIParams> = {}
  ): Promise<[Resource[], Pagination]> {
    return this.c
      .get<{
        resources: Resource[];
        pagination: Pagination;
      }>(`/initia/move/v1/accounts/${address}/resources`, params)
      .then(d => [
        d.resources.map(res => ({
          address: res.address,
          struct_tag: res.struct_tag,
          resource_bytes: res.resource_bytes,
          move_resource: res.move_resource,
        })),
        d.pagination,
      ]);
  }

  public async resource(
    address: AccAddress,
    structTag: string,
    params: APIParams = {}
  ): Promise<Resource> {
    return this.c
      .get<{ resource: Resource }>(
        `/initia/move/v1/accounts/${address}/resources/${structTag}`,
        params
      )
      .then(({ resource: d }) => ({
        address: d.address,
        struct_tag: d.struct_tag,
        resource_bytes: d.resource_bytes,
        move_resource: d.move_resource,
      }));
  }

  public async scriptABI(codeBytes: string): Promise<ABI> {
    return this.c.post<ABI>(`/initia/move/v1/script/abi`, {
      code_bytes: codeBytes,
    });
  }
}
