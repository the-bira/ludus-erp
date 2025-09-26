"use server";

import { db, generateId, getCurrentTimestamp } from "@/lib/firebase";
import { CreateTurmaData, Turma } from "@/lib/schemas";
import { revalidatePath } from "next/cache";

// Interface para documentos do Firestore
interface FirestoreDoc {
  id: string;
  data(): Record<string, unknown>;
}

// Criar nova turma
export async function createTurmaAction(data: CreateTurmaData) {
  try {
    const id = generateId();
    const now = getCurrentTimestamp();

    const turma: Turma = {
      id,
      nome: data.nome,
      diasSemana: data.diasSemana,
      pessoasIds: data.pessoasIds,
      timestamps: {
        createdAt: now,
        updatedAt: now,
      },
    };

    await db.collection("turmas").doc(id).set(turma);

    revalidatePath("/turmas");
    return { success: true, data: turma };
  } catch (error) {
    console.error("Erro ao criar turma:", error);
    return { success: false, error: "Erro ao criar turma" };
  }
}

// Buscar todas as turmas
export async function getTurmasAction() {
  try {
    const snapshot = await db
      .collection("turmas")
      .orderBy("timestamps.createdAt", "desc")
      .get();
    const turmas = snapshot.docs.map(
      (doc: FirestoreDoc) => ({ id: doc.id, ...doc.data() } as Turma)
    );
    return { success: true, data: turmas };
  } catch (error) {
    console.error("Erro ao buscar turmas:", error);
    return { success: false, error: "Erro ao buscar turmas" };
  }
}

// Buscar turma por ID
export async function getTurmaByIdAction(id: string) {
  try {
    const doc = await db.collection("turmas").doc(id).get();
    if (!doc.exists) {
      return { success: false, error: "Turma não encontrada" };
    }
    return { success: true, data: { id: doc.id, ...doc.data() } as Turma };
  } catch (error) {
    console.error("Erro ao buscar turma:", error);
    return { success: false, error: "Erro ao buscar turma" };
  }
}

// Atualizar turma
export async function updateTurmaAction(
  id: string,
  data: Partial<CreateTurmaData>
) {
  try {
    const updateData = {
      ...data,
      timestamps: {
        updatedAt: getCurrentTimestamp(),
      },
    };

    await db.collection("turmas").doc(id).update(updateData);

    revalidatePath("/turmas");
    revalidatePath(`/turmas/${id}`);
    return { success: true };
  } catch (error) {
    console.error("Erro ao atualizar turma:", error);
    return { success: false, error: "Erro ao atualizar turma" };
  }
}

// Adicionar pessoa à turma
export async function addPessoaToTurmaAction(
  turmaId: string,
  pessoaId: string
) {
  try {
    const turmaRef = db.collection("turmas").doc(turmaId);
    const turma = await turmaRef.get();

    if (!turma.exists) {
      return { success: false, error: "Turma não encontrada" };
    }

    const turmaData = turma.data() as Turma;
    const pessoasIds = [...turmaData.pessoasIds];

    if (!pessoasIds.includes(pessoaId)) {
      pessoasIds.push(pessoaId);
      await turmaRef.update({
        pessoasIds,
        "timestamps.updatedAt": getCurrentTimestamp(),
      });
    }

    revalidatePath("/turmas");
    revalidatePath(`/turmas/${turmaId}`);
    return { success: true };
  } catch (error) {
    console.error("Erro ao adicionar pessoa à turma:", error);
    return { success: false, error: "Erro ao adicionar pessoa à turma" };
  }
}

// Remover pessoa da turma
export async function removePessoaFromTurmaAction(
  turmaId: string,
  pessoaId: string
) {
  try {
    const turmaRef = db.collection("turmas").doc(turmaId);
    const turma = await turmaRef.get();

    if (!turma.exists) {
      return { success: false, error: "Turma não encontrada" };
    }

    const turmaData = turma.data() as Turma;
    const pessoasIds = turmaData.pessoasIds.filter((id) => id !== pessoaId);

    await turmaRef.update({
      pessoasIds,
      "timestamps.updatedAt": getCurrentTimestamp(),
    });

    revalidatePath("/turmas");
    revalidatePath(`/turmas/${turmaId}`);
    return { success: true };
  } catch (error) {
    console.error("Erro ao remover pessoa da turma:", error);
    return { success: false, error: "Erro ao remover pessoa da turma" };
  }
}

// Deletar turma
export async function deleteTurmaAction(id: string) {
  try {
    await db.collection("turmas").doc(id).delete();

    revalidatePath("/turmas");
    return { success: true };
  } catch (error) {
    console.error("Erro ao deletar turma:", error);
    return { success: false, error: "Erro ao deletar turma" };
  }
}
