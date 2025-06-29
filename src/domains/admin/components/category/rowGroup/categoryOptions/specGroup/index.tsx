"use client";

import { useState } from "react";

import { addSingleSpec, deleteSingleSpec, deleteSpecGroup } from "@/actions/category/categoryOptions";
import Button from "@/shared/components/UI/button";
import Input from "@/shared/components/UI/input";
import { TSingleSpec, TSpecGroup } from "@/shared/types/common";

type TProps = {
  data: TSpecGroup;
  reloadRequest: () => void;
};

const SpecGroup = ({ data, reloadRequest }: TProps) => {
  const { id, title, specs } = data;
  const [isLoading, setIsLoading] = useState(false);
  const [specToAdd, setSpecToAdd] = useState("");
  const handleDeleteSpecGroup = async () => {
    if (!id) return;
    setIsLoading(true);
    const response = await deleteSpecGroup(id);
    if (response.error) {
      setIsLoading(false);
      return;
    }
    if (response.res) {
      setIsLoading(false);
      reloadRequest();
    }
  };

  const handleAddSingleSpec = async () => {
    if (!id || !specToAdd || specToAdd === "") return;

    setIsLoading(true);
    const data: TSingleSpec = {
      specGroupID: id,
      value: specToAdd,
    };

    const response = await addSingleSpec(data);
    if (response.error) {
      setIsLoading(false);
      return;
    }
    if (response.res) {
      setIsLoading(false);
      setSpecToAdd("");
      reloadRequest();
    }
  };

  const handleDeleteSingleSpec = async (spec: string) => {
    if (!id || !spec || spec === "") return;

    setIsLoading(true);
    const data: TSingleSpec = {
      specGroupID: id,
      value: spec,
    };

    const response = await deleteSingleSpec(data);
    if (response.error) {
      setIsLoading(false);
      return;
    }
    if (response.res) {
      setIsLoading(false);
      reloadRequest();
    }
  };

  return (
    <div className="w-full flex flex-col rounded-[8px] border border-orange-300 pb-2">
      <div className="w-full p-3 flex justify-between border-b border-gray-200 mb-1.5">
        <div className="flex items-center gap-3">
          <span>{title}</span>
          <Button disabled={isLoading} onClick={() => handleDeleteSpecGroup()}>
            delete
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <Input
            disabled={isLoading}
            type="text"
            value={specToAdd}
            onChange={(e) => setSpecToAdd(e.currentTarget.value)}
          />
          <Button className="w-[150px]" disabled={isLoading} onClick={() => handleAddSingleSpec()}>
            Add Spec
          </Button>
        </div>
      </div>
      {specs.length ? (
        <>
          {specs.map((spec, index) => (
            <div
              className="flex px-3 py-2 mx-2 justify-between items-center rounded-md transition-colors duration-300"
              key={index}
            >
              <span>{spec}</span>
              <Button disabled={isLoading} onClick={() => handleDeleteSingleSpec(spec)}>
                delete
              </Button>
            </div>
          ))}
        </>
      ) : (
        <div className="flex px-3 py-2 mx-2 justify-between items-center rounded-md">
          <span>There is no specification!</span>
        </div>
      )}
    </div>
  );
};

export default SpecGroup;
