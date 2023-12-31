"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { AiOutlineDelete, AiOutlineEdit } from "react-icons/ai";
import ToggleDelete from "./ToggleDelete";
import ToggleEdit from "./ToggleEdit";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

type SheetLineProps = {
  description: string;
  value: string;
  situation: string;
  id: string;
};

const SheetLine = ({ description, value, situation, id }: SheetLineProps) => {
  const [toggleDelete, setToggleDelete] = useState(false);
  const [toggleEdit, setToggleEdit] = useState(false);

  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id: id,
    });

  const style = { transition, transform: CSS.Transform.toString(transform) };

  const queryClient = useQueryClient();
  let deleteToastID: string;

  const { mutate } = useMutation(
    async (id: string) =>
      await axios.delete("/api/expensesAndEarnings/delete", { params: { id } }),
    {
      onError: (error) => {
        if (error instanceof AxiosError) {
          toast.remove(deleteToastID);
          toast.error(error?.response?.data.message, { id: deleteToastID });
        }
      },
      onSuccess: (data) => {
        console.log(data);
        queryClient.invalidateQueries(["expenses"]);
        queryClient.invalidateQueries(["earnings"]);
        toast.remove(deleteToastID);
        toast.success("Deleted.", { id: deleteToastID });
      },
    }
  );

  const deleteExpenseOrEarning = async () => {
    deleteToastID = toast.loading("Deleting...", { id: deleteToastID });
    mutate(id);
  };

  const onToggleDelete = () => {
    setToggleDelete(!toggleDelete);
  };
  const onToggleEdit = () => {
    setToggleEdit(!toggleEdit);
  };

  return (
    <>
      <li ref={setNodeRef} style={style} {...attributes} {...listeners}>
        <div className="flex justify-between">
          <span className="w-[45%]">{description}</span>
          <span className="w-[22%]">
            {Number(value).toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
            })}
          </span>
          <span className="w-[23%] uppercase">{situation}</span>
          <div className="w-[10%] flex gap-4 ">
            <button
              className="text-xl"
              onClick={() => setToggleEdit(!toggleEdit)}
            >
              <AiOutlineEdit />
            </button>
            <button
              className="text-xl"
              onClick={() => setToggleDelete(!toggleDelete)}
            >
              <AiOutlineDelete />
            </button>
          </div>
        </div>
        <hr className="mt-2" />
      </li>
      {toggleDelete && (
        <ToggleDelete
          onToggle={onToggleDelete}
          onDelete={deleteExpenseOrEarning}
        />
      )}
      {toggleEdit && (
        <ToggleEdit
          onToggle={onToggleEdit}
          lineData={{ description, value, situation, id }}
        />
      )}
    </>
  );
};

export default SheetLine;
