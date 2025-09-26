"use server";

import { db, generateId, getCurrentTimestamp } from "@/lib/firebase";
import { CreatePresencaData, Presenca } from "@/lib/schemas";
import { revalidatePath } from "next/cache";

// Interface para documentos do Firestore
interface FirestoreDoc {
  id: string;
  data(): Record<string, unknown>;
}

// Registrar presença
export async function registrarPresencaAction(data: CreatePresencaData) {
  try {
    const id = generateId();
    const now = getCurrentTimestamp();

    const presenca: Presenca = {
      id,
      turmaId: data.turmaId,
      pessoaId: data.pessoaId,
      data: data.data,
      presente: data.presente,
      observacoes: data.observacoes,
      timestamps: {
        createdAt: now,
        updatedAt: now,
      },
    };

    await db.collection("presencas").doc(id).set(presenca);

    revalidatePath("/presencas");
    revalidatePath(`/turmas/${data.turmaId}`);
    return { success: true, data: presenca };
  } catch (error) {
    console.error("Erro ao registrar presença:", error);
    return { success: false, error: "Erro ao registrar presença" };
  }
}

// Buscar presenças por turma e data
export async function getPresencasByTurmaAndDataAction(
  turmaId: string,
  data: string
) {
  try {
    const snapshot = await db
      .collection("presencas")
      .where("turmaId", "==", turmaId)
      .where("data", "==", data)
      .get();

    const presencas = snapshot.docs.map(
      (doc: FirestoreDoc) => ({ id: doc.id, ...doc.data() } as Presenca)
    );
    return { success: true, data: presencas };
  } catch (error) {
    console.error("Erro ao buscar presenças:", error);
    return { success: false, error: "Erro ao buscar presenças" };
  }
}

// Buscar presenças por pessoa
export async function getPresencasByPessoaAction(pessoaId: string) {
  try {
    const snapshot = await db
      .collection("presencas")
      .where("pessoaId", "==", pessoaId)
      .orderBy("data", "desc")
      .get();

    const presencas = snapshot.docs.map(
      (doc: FirestoreDoc) => ({ id: doc.id, ...doc.data() } as Presenca)
    );
    return { success: true, data: presencas };
  } catch (error) {
    console.error("Erro ao buscar presenças por pessoa:", error);
    return { success: false, error: "Erro ao buscar presenças por pessoa" };
  }
}

// Buscar presenças por turma
export async function getPresencasByTurmaAction(turmaId: string) {
  try {
    const snapshot = await db
      .collection("presencas")
      .where("turmaId", "==", turmaId)
      .orderBy("data", "desc")
      .get();

    const presencas = snapshot.docs.map(
      (doc: FirestoreDoc) => ({ id: doc.id, ...doc.data() } as Presenca)
    );
    return { success: true, data: presencas };
  } catch (error) {
    console.error("Erro ao buscar presenças por turma:", error);
    return { success: false, error: "Erro ao buscar presenças por turma" };
  }
}

// Atualizar presença
export async function updatePresencaAction(
  id: string,
  data: Partial<CreatePresencaData>
) {
  try {
    const updateData = {
      ...data,
      timestamps: {
        updatedAt: getCurrentTimestamp(),
      },
    };

    await db.collection("presencas").doc(id).update(updateData);

    revalidatePath("/presencas");
    return { success: true };
  } catch (error) {
    console.error("Erro ao atualizar presença:", error);
    return { success: false, error: "Erro ao atualizar presença" };
  }
}

// Deletar presença
export async function deletePresencaAction(id: string) {
  try {
    await db.collection("presencas").doc(id).delete();

    revalidatePath("/presencas");
    return { success: true };
  } catch (error) {
    console.error("Erro ao deletar presença:", error);
    return { success: false, error: "Erro ao deletar presença" };
  }
}

// Calcular frequência de uma pessoa
export async function getFrequenciaPessoaAction(
  pessoaId: string,
  dataInicio?: string,
  dataFim?: string
) {
  try {
    let query = db.collection("presencas").where("pessoaId", "==", pessoaId);

    if (dataInicio) {
      query = query.where("data", ">=", dataInicio);
    }
    if (dataFim) {
      query = query.where("data", "<=", dataFim);
    }

    const snapshot = await query.get();
    const presencas = snapshot.docs.map(
      (doc: FirestoreDoc) => ({ id: doc.id, ...doc.data() } as Presenca)
    );

    const totalAulas = presencas.length;
    const presencasConfirmadas = presencas.filter(
      (p: Presenca) => p.presente
    ).length;
    const frequencia =
      totalAulas > 0 ? (presencasConfirmadas / totalAulas) * 100 : 0;

    return {
      success: true,
      data: {
        totalAulas,
        presencasConfirmadas,
        frequencia: Math.round(frequencia * 100) / 100,
      },
    };
  } catch (error) {
    console.error("Erro ao calcular frequência:", error);
    return { success: false, error: "Erro ao calcular frequência" };
  }
}
