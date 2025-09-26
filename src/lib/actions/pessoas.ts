"use server";

import {
  db,
  generateId,
  generateMatricula,
  getCurrentTimestamp,
} from "@/lib/firebase";
import { CreatePessoaData, UpdatePessoaData, Pessoa } from "@/lib/schemas";
import { revalidatePath } from "next/cache";

// Interface para documentos do Firestore
interface FirestoreDoc {
  id: string;
  data(): Record<string, unknown>;
}

// Criar nova pessoa
export async function createPessoaAction(data: CreatePessoaData) {
  try {
    const id = generateId();
    const matricula = generateMatricula();
    const now = getCurrentTimestamp();

    const pessoa: Pessoa = {
      id,
      nome: data.nome,
      dataNascimento: data.dataNascimento,
      identidade: data.identidade,
      fotoUrl: "", // Será preenchido após upload
      matricula,
      status: "ativo",
      timestamps: {
        createdAt: now,
        updatedAt: now,
      },
    };

    await db.collection("pessoas").doc(id).set(pessoa);

    revalidatePath("/pessoas");
    return { success: true, data: pessoa };
  } catch (error) {
    console.error("Erro ao criar pessoa:", error);
    return { success: false, error: "Erro ao criar pessoa" };
  }
}

// Buscar todas as pessoas
export async function getPessoasAction() {
  try {
    const snapshot = await db
      .collection("pessoas")
      .orderBy("timestamps.createdAt", "desc")
      .get();
    const pessoas = snapshot.docs.map(
      (doc: FirestoreDoc) => ({ id: doc.id, ...doc.data() } as Pessoa)
    );
    return { success: true, data: pessoas };
  } catch (error) {
    console.error("Erro ao buscar pessoas:", error);
    return { success: false, error: "Erro ao buscar pessoas" };
  }
}

// Buscar pessoa por ID
export async function getPessoaByIdAction(id: string) {
  try {
    const doc = await db.collection("pessoas").doc(id).get();
    if (!doc.exists) {
      return { success: false, error: "Pessoa não encontrada" };
    }
    return { success: true, data: { id: doc.id, ...doc.data() } as Pessoa };
  } catch (error) {
    console.error("Erro ao buscar pessoa:", error);
    return { success: false, error: "Erro ao buscar pessoa" };
  }
}

// Atualizar pessoa
export async function updatePessoaAction(id: string, data: UpdatePessoaData) {
  try {
    const updateData = {
      ...data,
      timestamps: {
        updatedAt: getCurrentTimestamp(),
      },
    };

    await db.collection("pessoas").doc(id).update(updateData);

    revalidatePath("/pessoas");
    revalidatePath(`/pessoas/${id}`);
    return { success: true };
  } catch (error) {
    console.error("Erro ao atualizar pessoa:", error);
    return { success: false, error: "Erro ao atualizar pessoa" };
  }
}

// Deletar pessoa
export async function deletePessoaAction(id: string) {
  try {
    await db.collection("pessoas").doc(id).delete();

    revalidatePath("/pessoas");
    return { success: true };
  } catch (error) {
    console.error("Erro ao deletar pessoa:", error);
    return { success: false, error: "Erro ao deletar pessoa" };
  }
}

// Buscar pessoas por status
export async function getPessoasByStatusAction(
  status: "ativo" | "trancado" | "inativo"
) {
  try {
    const snapshot = await db
      .collection("pessoas")
      .where("status", "==", status)
      .orderBy("timestamps.createdAt", "desc")
      .get();

    const pessoas = snapshot.docs.map(
      (doc: FirestoreDoc) => ({ id: doc.id, ...doc.data() } as Pessoa)
    );
    return { success: true, data: pessoas };
  } catch (error) {
    console.error("Erro ao buscar pessoas por status:", error);
    return { success: false, error: "Erro ao buscar pessoas por status" };
  }
}
