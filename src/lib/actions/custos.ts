"use server";

import { db, generateId, getCurrentTimestamp } from "@/lib/firebase";
import { CreateCustoData, Custo } from "@/lib/schemas";
import { revalidatePath } from "next/cache";

// Interface para documentos do Firestore
interface FirestoreDoc {
  id: string;
  data(): Record<string, unknown>;
}

// Criar novo custo
export async function createCustoAction(data: CreateCustoData) {
  try {
    const id = generateId();
    const now = getCurrentTimestamp();

    const custo: Custo = {
      id,
      tipo: data.tipo,
      descricao: data.descricao,
      valor: data.valor,
      data: data.data,
      timestamps: {
        createdAt: now,
        updatedAt: now,
      },
    };

    await db.collection("custos").doc(id).set(custo);

    revalidatePath("/custos");
    return { success: true, data: custo };
  } catch (error) {
    console.error("Erro ao criar custo:", error);
    return { success: false, error: "Erro ao criar custo" };
  }
}

// Buscar todos os custos
export async function getCustosAction() {
  try {
    const snapshot = await db
      .collection("custos")
      .orderBy("timestamps.createdAt", "desc")
      .get();
    const custos = snapshot.docs.map(
      (doc: FirestoreDoc) => ({ id: doc.id, ...doc.data() } as Custo)
    );
    return { success: true, data: custos };
  } catch (error) {
    console.error("Erro ao buscar custos:", error);
    return { success: false, error: "Erro ao buscar custos" };
  }
}

// Buscar custo por ID
export async function getCustoByIdAction(id: string) {
  try {
    const doc = await db.collection("custos").doc(id).get();
    if (!doc.exists) {
      return { success: false, error: "Custo não encontrado" };
    }
    return { success: true, data: { id: doc.id, ...doc.data() } as Custo };
  } catch (error) {
    console.error("Erro ao buscar custo:", error);
    return { success: false, error: "Erro ao buscar custo" };
  }
}

// Atualizar custo
export async function updateCustoAction(id: string, data: Partial<CreateCustoData>) {
  try {
    const updateData = {
      ...data,
      timestamps: {
        updatedAt: getCurrentTimestamp(),
      },
    };

    await db.collection("custos").doc(id).update(updateData);

    revalidatePath("/custos");
    revalidatePath(`/custos/${id}`);
    return { success: true };
  } catch (error) {
    console.error("Erro ao atualizar custo:", error);
    return { success: false, error: "Erro ao atualizar custo" };
  }
}

// Deletar custo
export async function deleteCustoAction(id: string) {
  try {
    await db.collection("custos").doc(id).delete();

    revalidatePath("/custos");
    return { success: true };
  } catch (error) {
    console.error("Erro ao deletar custo:", error);
    return { success: false, error: "Erro ao deletar custo" };
  }
}

// Buscar custos do mês atual
export async function getCustosMesAtualAction() {
  try {
    const now = new Date();
    const primeiroDiaMes = new Date(
      now.getFullYear(),
      now.getMonth(),
      1
    ).toISOString();
    const ultimoDiaMes = new Date(
      now.getFullYear(),
      now.getMonth() + 1,
      0
    ).toISOString();

    const snapshot = await db
      .collection("custos")
      .where("data", ">=", primeiroDiaMes)
      .where("data", "<=", ultimoDiaMes)
      .get();

    const custos = snapshot.docs.map(
      (doc: FirestoreDoc) => ({ id: doc.id, ...doc.data() } as Custo)
    );
    return { success: true, data: custos };
  } catch (error) {
    console.error("Erro ao buscar custos do mês:", error);
    return { success: false, error: "Erro ao buscar custos do mês" };
  }
}

// Buscar custos por tipo
export async function getCustosByTipoAction(tipo: string) {
  try {
    const snapshot = await db
      .collection("custos")
      .where("tipo", "==", tipo)
      .orderBy("timestamps.createdAt", "desc")
      .get();

    const custos = snapshot.docs.map(
      (doc: FirestoreDoc) => ({ id: doc.id, ...doc.data() } as Custo)
    );
    return { success: true, data: custos };
  } catch (error) {
    console.error("Erro ao buscar custos por tipo:", error);
    return { success: false, error: "Erro ao buscar custos por tipo" };
  }
}